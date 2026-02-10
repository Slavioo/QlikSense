define(["qlik", "jquery"], function(qlik, $) {
    return {
        definition: {
            type: "items",
            component: "accordion",
            items: {
                settings: {
                    uses: "settings",
                    label: "Items",
                    type: "items",
                    items: {
                        cards: {
                            ref: "cards",
                            label: "KPIs",
                            type: "array",
                            allowAdd: true,
                            allowRemove: true,
                            addTranslation: "Add KPI",
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
                                backgroundColor: {
                                    type: "string",
                                    ref: "backgroundColor",
                                    label: "Background Color",
                                    expression: "optional"
                                },
                                titleColor: {
                                    type: "string",
                                    ref: "titleColor",
                                    label: "Title Color",
                                    expression: "optional"
                                },
                                valueColor: {
                                    type: "string",
                                    ref: "valueColor",
                                    label: "Value Color",
                                    expression: "optional"
                                },
                                descriptionColor: {
                                    type: "string",
                                    ref: "descriptionColor",
                                    label: "Description Color",
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
                            defaultValue: `='
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.kpi-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 4px;
    width: 100%;
    height: 100%;
    padding: 4px;
    overflow: hidden;
}

.kpi-card {
    background-color: inherit;
    border-radius: 2px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    padding: 4px 6px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
    transition: box-shadow 0.3s ease;
    position: relative;
    min-height: 0;
    container-type: size;
}

.kpi-card:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.kpi-card.selected::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 4px;
    background-color: #2ecc71;
    border-radius: 0 0 2px 2px;
}

.kpi-title {
    font-size: 20cqh;
    font-weight: bold;
    color: inherit;
    text-align: center;
    line-height: 1;
    margin-bottom: 8px;
}

.kpi-value {
    font-size: 40cqh;
    font-weight: bold;
    margin: 0;
    color: inherit;
    text-align: center;
    line-height: 1;
}

.kpi-description {
    font-size: 20cqh;
    color: inherit;
    text-align: center;
    line-height: 1;
    margin-top: 8px;
}
'`
                        }
                    }
                }
            }
        },

        support: {
            exportData: false
        },

        paint: async function($element, layout) {
            const objectId = layout.qInfo.qId || "";
            
            let properties = null;
            try {
                properties = await this.backendApi.model.enigmaModel.getProperties();
            } catch (err) {
                $element.html(`<div style="padding: 16px; color: red;">Error getting properties: ${err.message}</div>`);
                return;
            }

            const rows = properties.cards || [];
            const columns = [
                "Title",
                "Value",
                "Description",
                "Background Color",
                "Title Color",
                "Value Color",
                "Description Color",
                "Navigate Sheet ID",
                "Filters",
                "Variables"
            ];

            const escapeHtml = (str) => {
                if (str === null || str === undefined) return "";
                return String(str)
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#39;");
            };

            const extractValue = (val) => {
                if (!val) return "";
                if (typeof val === "string") return val;
                if (val.qStringExpression && val.qStringExpression.qExpr) {
                    const expr = val.qStringExpression.qExpr;
                    // Only add = sign if not already present
                    return expr.startsWith("=") ? expr : "=" + expr;
                }
                return "";
            };

            const transposedData = columns.map(col => ({
                colName: col,
                values: rows.map(row => {
                    switch (col) {
                        case "Title": 
                            return extractValue(row.title);
                        case "Value": 
                            return extractValue(row.value);
                        case "Description": 
                            return extractValue(row.description);
                        case "Background Color": 
                            return extractValue(row.backgroundColor);
                        case "Title Color": 
                            return extractValue(row.titleColor);
                        case "Value Color": 
                            return extractValue(row.valueColor);
                        case "Description Color": 
                            return extractValue(row.descriptionColor);
                        case "Navigate Sheet ID": 
                            return extractValue(row.navigateSheetId);
                        case "Filters":
                            return Array.isArray(row.filters)
                                ? row.filters.map(f => `${extractValue(f.field)}: ${extractValue(f.value)}`).join(" | ")
                                : "";
                        case "Variables":
                            return Array.isArray(row.variables)
                                ? row.variables.map(v => `${extractValue(v.name)}: ${extractValue(v.value)}`).join(" | ")
                                : "";
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
                        transition: all 0.2s;
                    }
                    .copy-button:hover { 
                        background-color: #0078d4; 
                        color: white; 
                    }
                    .copy-button.success {
                        background-color: #2ecc71;
                        color: white;
                        border-color: #2ecc71;
                    }

                    table.kpi-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-family: Arial, sans-serif;
                        font-size: 11px;
                    }
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

                <button class="copy-button" id="copyObjectIdBtn">
                    Copy Object ID: ${escapeHtml(objectId)}
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
                const btn = $(this);
                if (!objectId) return;
                const tempInput = $("<textarea>");
                $("body").append(tempInput);
                tempInput.val(objectId).select();
                document.execCommand("copy");
                tempInput.remove();
                
                btn.addClass("success").text("Copied!");
                setTimeout(() => {
                    btn.removeClass("success").text(`Copy Object ID: ${objectId}`);
                }, 2000);
            });
        }
    };
});
