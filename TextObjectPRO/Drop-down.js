define(["qlik", "jquery"], function (qlik, $) {
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
                                    label: "Dimension Label",
                                    expression: "optional"
                                },
                                field: {
                                    type: "string",
                                    ref: "field",
                                    label: "Field Name",
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

            // Unique container ID
            const containerId = `dim-selector-${layout.qInfo.qId}`;
            $element.empty().html(`<div id="${containerId}" style="padding: 16px; font-family: system-ui, sans-serif;"></div>`);
            const $container = $(`#${containerId}`);

            // Generate dropdown HTML
            let html = "";
            dimensions.forEach((dim, idx) => {
                const dimId = `${containerId}-dim-${idx}`;
                const values = (dim.allowedValues || []).map(v => v.value).filter(Boolean);
                html += `
                    <div class="dim-block" style="margin-bottom: 12px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 4px;">${dim.label || dim.field}</label>
                        <select id="${dimId}" data-field="${dim.field}" data-dim-idx="${idx}" style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 3px;">
                            <option value="">(Clear selection)</option>
                            ${values.map(val => `<option value="${$('<div/>').text(val).html()}">${val}</option>`).join("")}
                        </select>
                    </div>
                `;
            });
            $container.html(html);

            // Event handlers for dropdown changes
            dimensions.forEach((dim, idx) => {
                const dimId = `#${containerId}-dim-${idx}`;
                $(dimId).on("change", async function () {
                    const value = $(this).val();
                    const fieldName = $(this).data("field");

                    if (!fieldName) {
                        console.warn("No field name configured");
                        return;
                    }

                    try {
                        const field = app.field(fieldName);
                        if (!value) {
                            await field.clear();
                        } else {
                            await field.selectValues([{ qText: value }], false, false);
                        }
                        console.log(`Applied selection in ${fieldName}: ${value || 'cleared'}`);
                    } catch (err) {
                        console.error("Selection failed:", err);
                    }
                });
            });

            // Optional: Log matching tables (for debugging)
            if (objectIds.length && dimensions.length) {
                getMatchingTables(app, objectIds, dimensions).then(matches => {
                    console.log("Matching tables:", matches);
                });
            }
        }
    };

    // Helper: Find which object IDs match dimension labels (table titles)
    async function getMatchingTables(app, objectIds, dimensions) {
        const matches = {};
        try {
            const promises = objectIds.map(async id => {
                const obj = await app.getObject(id);
                const layout = await obj.model.getLayout();
                return { id, title: layout.title };
            });
            const results = await Promise.allSettled(promises);
            results.forEach(result => {
                if (result.status === "fulfilled") {
                    const { id, title } = result.value;
                    const matchingDim = dimensions.find(dim => dim.label === title);
                    if (matchingDim) {
                        matches[matchingDim.field] = id;
                    }
                }
            });
        } catch (err) {
            console.warn("Could not fetch object layouts:", err);
        }
        return matches;
    }
});
