define(["qlik", "jquery"], function(qlik, $) {
    return {
        definition: {
            type: "items",
            component: "accordion",
            items: {
                settings: {
                    label: "Items",
                    type: "items",
                    items: {
                        cards: {
                            ref: "cards",
                            label: "Rows",
                            type: "array",
                            allowAdd: true,
                            allowRemove: true,
                            addTranslation: "Add Row",
                            itemTitleRef: "title",
                            items: {
                                title: {
                                    type: "string",
                                    ref: "title",
                                    label: "Title",
                                    expression: "optional"
                                },
                                value: {
                                    type: "string",
                                    ref: "value",
                                    label: "Value",
                                    expression: "optional"
                                },
                                description: {
                                    type: "string",
                                    ref: "description",
                                    label: "Description",
                                    expression: "optional"
                                },
                                color: {
                                    type: "string",
                                    ref: "color",
                                    label: "Color",
                                    expression: "optional"
                                },
                                navigateSheetId: {
                                    type: "string",
                                    ref: "navigateSheetId",
                                    label: "Navigate to Sheet ID",
                                    expression: "optional"
                                },
                                filters: {
                                    type: "array",
                                    ref: "filters",
                                    label: "Filters",
                                    allowAdd: true,
                                    allowRemove: true,
                                    addTranslation: "Add Filter",
                                    itemTitleRef: "field",
                                    items: {
                                        field: {
                                            type: "string",
                                            ref: "field",
                                            label: "Filter in Field",
                                            expression: "optional"
                                        },
                                        value: {
                                            type: "string",
                                            ref: "value",
                                            label: "Filter Value",
                                            expression: "optional"
                                        }
                                    }
                                },
                                variables: {
                                    type: "array",
                                    ref: "variables",
                                    label: "Variables",
                                    allowAdd: true,
                                    allowRemove: true,
                                    addTranslation: "Add Variable",
                                    itemTitleRef: "name",
                                    items: {
                                        name: {
                                            type: "string",
                                            ref: "name",
                                            label: "Variable Name",
                                            expression: "optional"
                                        },
                                        value: {
                                            type: "string",
                                            ref: "value",
                                            label: "Variable Value",
                                            expression: "optional"
                                        }
                                    }
                                }
                            }
                        },
                        customCss: {
                            type: "string",
                            ref: "customCss",
                            label: "Custom CSS",
                            expression: "optional",
                            defaultValue: `
                            * { margin:0; padding:0; box-sizing:border-box; }
                            .kpi-container { display: grid; grid-template-columns: repeat(6, 1fr); grid-gap: 16px; width: 100%; height: 100%; padding: 16px; overflow-y: auto; overflow-x: hidden; }
                            .kpi-card { background-color: #ffffff; border-radius: 4px; box-shadow: 0 4px 4px rgba(0,0,0,0.1); padding: 16px; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; transition: box-shadow 0.3s ease; }
                            .kpi-card:hover { box-shadow: 0 6px 6px rgba(0,0,0,0.2); }
                            .kpi-card.selected { background-color: rgba(0,120,212,0.1); }
                            .kpi-title { font-size: 1.2em; font-weight: bold; color: #333; text-align: center; }
                            .kpi-value { font-size: 2em; font-weight: bold; margin: 8px 0; color: inherit; text-align: center; }
                            .kpi-description { font-size: 1em; color: #777; text-align: center; }`
                        }
                    }
                }
            }
        },

        support: {
            exportData: false
        },

        paint: function($element, layout) {
            const rows = layout.cards || [];
            const columns = ["Title", "Value", "Description", "Color", "Navigate Sheet ID", "Filters", "Variables"];

            const escapeHtml = (str) => {
                if (str === null || str === undefined) return "";
                return String(str)
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#39;");
            };

            const getRawValue = (val) => val || "";

            const transposedData = columns.map(col => ({
                colName: getRawValue(col),
                values: rows.map(row => {
                    switch (col) {
                        case "Title":
                            return getRawValue(row.title);
                        case "Value":
                            return getRawValue(row.value);
                        case "Description":
                            return getRawValue(row.description);
                        case "Color":
                            return getRawValue(row.color);
                        case "Navigate Sheet ID":
                            return getRawValue(row.navigateSheetId);
                        case "Filters":
                            return Array.isArray(row.filters) ?
                                row.filters.map(f => `${getRawValue(f.field)}: ${getRawValue(f.value)}`).join(" | ") :
                                "";
                        case "Variables":
                            return Array.isArray(row.variables) ?
                                row.variables.map(v => `${getRawValue(v.name)}: ${getRawValue(v.value)}`).join(" | ") :
                                "";
                        default:
                            return "";
                    }
                })
            }));

            const html = `
                <style>
                    .copy-button {
                        display: inline-block;
                        margin-bottom: 8px;
                        padding: 6px 12px;
                        font-size: 12px;
                        cursor: pointer;
                        border-radius: 4px;
                        border: 1px solid #0078d4;
                        background-color: #f0f8ff;
                        color: #0078d4;
                    }
                    .copy-button:hover { background-color: #0078d4; color: white; }

                    table.kpi-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-family: Arial, sans-serif;
                        font-size: 11px;
                    }
                    table.kpi-table th,
                    table.kpi-table td {
                        border: 1px solid #ddd;
                        padding: 4px 6px;
                        text-align: left;
                        vertical-align: top;
                        line-height: 1.2;
                        color: #555;
                    }
                    table.kpi-table td:first-child {
                        background-color: #f0f0f0;
                        font-weight: bold;
                        color: #333;
                        white-space: nowrap;
                    }
                    table.kpi-table tbody tr:hover td {
                        background-color: #e6f0ff;
                    }
                </style>

                <button class="copy-button" id="copyObjectIdBtn" title="Copy Object ID to clipboard">
                    Copy Object ID: ${escapeHtml(layout.qInfo.qId || "")}
                </button>

                <table class="kpi-table">
                    <tbody>
                        ${transposedData.map(row => `
                            <tr>
                                <td>${escapeHtml(row.colName)}</td>
                                ${row.values.map(val => `<td>${escapeHtml(val)}</td>`).join("")}
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            `;

            $element.html(html);

            $element.find("#copyObjectIdBtn").on("click", function() {
                const objectId = layout.qInfo.qId || "";
                if (!objectId) return;
                const tempInput = $("<input>");
                $("body").append(tempInput);
                tempInput.val(objectId).select();
                document.execCommand("copy");
                tempInput.remove();
            });
        }
    };
});
