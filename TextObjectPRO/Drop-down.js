define(["qlik", "jquery", "css!./dimension-selector.css"], function (qlik, $) {
    "use strict";

    return {
        initialProperties: {
            version: 1.0,
            props: {
                objectIds: [],
                dimensions: []
            }
        },
        definition: {
            type: "items",
            component: "accordion",
            items: {
                settings: {
                    uses: "settings",
                    items: {
                        objectIds: {
                            type: "array",
                            ref: "props.objectIds",
                            label: "Target Object IDs",
                            itemTitleRef: "id",
                            allowAdd: true,
                            allowRemove: true,
                            addTranslation: "Add Object ID",
                            items: {
                                id: {
                                    type: "string",
                                    ref: "id",
                                    label: "Object ID",
                                    expression: "optional"
                                }
                            }
                        },
                        dimensions: {
                            type: "array",
                            ref: "props.dimensions",
                            label: "Dimensions",
                            itemTitleRef: "label",
                            allowAdd: true,
                            allowRemove: true,
                            addTranslation: "Add Dimension",
                            items: {
                                label: {
                                    type: "string",
                                    ref: "label",
                                    label: "Column Name (to match)",
                                    expression: "optional"
                                },
                                field: {
                                    type: "string",
                                    ref: "field",
                                    label: "Target Field Name",
                                    expression: "optional"
                                },
                                allowedValues: {
                                    type: "array",
                                    ref: "allowedValues",
                                    label: "Allowed Values",
                                    itemTitleRef: "value",
                                    allowAdd: true,
                                    allowRemove: true,
                                    addTranslation: "Add Value",
                                    items: {
                                        value: {
                                            type: "string",
                                            ref: "value",
                                            label: "Value",
                                            expression: "optional"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        paint: function ($element, layout) {
            const app = qlik.currApp(this);
            const objectIds = (layout.props.objectIds || []).map(o => o.id).filter(Boolean);
            const dimensions = layout.props.dimensions || [];

            $element.empty();

            // Inject dropdowns into target tables
            objectIds.forEach(objectId => {
                injectDropdownsIntoTable(app, objectId, dimensions);
            });

            return qlik.Promise.resolve();
        }
    };

    async function injectDropdownsIntoTable(app, objectId, dimensions) {
        try {
            // Wait for the table to render
            await waitForElement(`[tid="${objectId}"]`, 5000);

            const $tableContainer = $(`[tid="${objectId}"]`);
            if (!$tableContainer.length) {
                console.warn(`Table with ID ${objectId} not found`);
                return;
            }

            // Get the table object to access its properties
            const tableObj = await app.visualization.get(objectId);
            const tableLayout = await tableObj.model.getLayout();

            dimensions.forEach(dim => {
                const columnLabel = dim.label;
                const targetField = dim.field;
                const values = (dim.allowedValues || []).map(v => v.value).filter(Boolean);

                // Find the column header that matches the dimension label
                const $headers = $tableContainer.find('thead th');
                $headers.each(function() {
                    const headerText = $(this).text().trim();
                    
                    if (headerText === columnLabel) {
                        const $header = $(this);
                        
                        // Remove existing dropdown if any
                        $header.find('.dim-dropdown-injected').remove();

                        // Create dropdown
                        const dropdownId = `dropdown-${objectId}-${columnLabel.replace(/s+/g, '-')}`;
                        const $dropdown = $(`
                            <div class="dim-dropdown-injected" style="margin-top: 4px;">
                                <select id="${dropdownId}" style="width: 100%; padding: 4px; font-size: 11px; border: 1px solid #ccc; border-radius: 3px;">
                                    <option value="">Select...</option>
                                    ${values.map(val => `<option value="${$('<div/>').text(val).html()}">${val}</option>`).join("")}
                                </select>
                            </div>
                        `);

                        $header.append($dropdown);

                        // Handle dropdown change - modify the table's dimension
                        $dropdown.find('select').on('change', async function() {
                            const selectedValue = $(this).val();
                            
                            if (!selectedValue) return;

                            try {
                                // Get current properties
                                const props = await tableObj.model.getProperties();
                                
                                // Find the dimension index that matches the column
                                const dimIndex = props.qHyperCubeDef.qDimensions.findIndex(d => {
                                    const label = d.qDef.qFieldLabels?.[0] || d.qDef.qLabel || d.qDef.qFieldDefs?.[0];
                                    return label === columnLabel;
                                });

                                if (dimIndex === -1) {
                                    console.warn(`Dimension with label "${columnLabel}" not found in table`);
                                    return;
                                }

                                // Create patch to change the dimension field
                                const patches = [{
                                    qOp: "replace",
                                    qPath: `/qHyperCubeDef/qDimensions/${dimIndex}/qDef/qFieldDefs/0`,
                                    qValue: JSON.stringify(selectedValue)
                                }];

                                await tableObj.model.applyPatches(patches, true);
                                console.log(`Changed dimension ${columnLabel} to value: ${selectedValue}`);
                                
                            } catch (err) {
                                console.error("Failed to update dimension:", err);
                            }
                        });
                    }
                });
            });

            // Re-inject when table re-renders
            tableObj.model.on('changed', () => {
                setTimeout(() => {
                    injectDropdownsIntoTable(app, objectId, dimensions);
                }, 100);
            });

        } catch (err) {
            console.error(`Error injecting dropdowns into ${objectId}:`, err);
        }
    }

    function waitForElement(selector, timeout = 5000) {
        return new qlik.Promise((resolve, reject) => {
            const startTime = Date.now();
            
            const checkExist = setInterval(() => {
                const $el = $(selector);
                if ($el.length) {
                    clearInterval(checkExist);
                    resolve($el);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(checkExist);
                    reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                }
            }, 100);
        });
    }
});
