define(["qlik", "jquery"], function(qlik, $) {
    return {
        definition: {
            type: "items",
            component: "accordion",
            items: {
                settings: {
                    uses: "settings",
                    items: {
                        visualizations: {
                            type: "array",
                            ref: "visualizations",
                            label: "Visualizations",
                            itemTitleRef: "id",
                            allowAdd: true,
                            allowRemove: true,
                            addTranslation: "Add Visualization",
                            items: {
                                id: {
                                    type: "string",
                                    ref: "id",
                                    label: "Visualization ID",
                                    expression: "optional"
                                },
                                columnId: {
                                    type: "integer",
                                    ref: "columnId",
                                    label: "Column ID",
                                    expression: "optional",
                                    defaultValue: 1
                                }
                            }
                        },
                        pageSize: {
                            type: "integer",
                            ref: "pageSize",
                            label: "Page Size (records per page)",
                            defaultValue: 50,
                            expression: 'optional'
                        },
                        css: {
                            type: "string",
                            ref: "css",
                            label: "CSS",
                            defaultValue: "",
                            expression: 'optional'
                        },
                        identifier: {
                            type: "string",
                            ref: "identifier",
                            label: "Identifier",
                            expression: "optional",
                            defaultValue: ""
                        },
                        valuesToCompare: {
                            type: "items",
                            label: "Values to compare",
                            items: {
                                prevColumnName: {
                                    type: "string",
                                    ref: "prevColumnName",
                                    label: "Previous Column Name",
                                    defaultValue: "Prev"
                                },
                                currColumnName: {
                                    type: "string",
                                    ref: "currColumnName",
                                    label: "Current Column Name",
                                    defaultValue: "Curr"
                                }
                            }
                        }
                    }
                }
            }
        },
        paint: async function($element, layout) {
            const app = qlik.currApp(this);
            const css = '<style>' + layout.css + '</style>';
            const visualizations = layout.visualizations || [];
            const prevColumnName = layout.prevColumnName || "Prev";
            const currColumnName = layout.currColumnName || "Curr";
            const identifier = layout.identifier || "";

            $element.empty().append(css);

            const groupedVisualizations = groupByColumnId(visualizations);

            const mainContainer = $('<div class="container ' + identifier + '"></div>');
            $element.append(mainContainer);

            for (const columnId in groupedVisualizations) {
                const columnContainer = $('<div class="column ' + identifier + '"></div>');
                mainContainer.append(columnContainer);

                for (const viz of groupedVisualizations[columnId]) {
                    const tableContainer = $('<div class="table-container ' + identifier + '"></div>')
                        .attr('data-grid-column-id', columnId);
                    columnContainer.append(tableContainer);
                    await displayData(app, viz.id, layout.pageSize, tableContainer, prevColumnName, currColumnName);
                }
            }

            // Event delegation for dynamically created elements
            $element.on('click', '.copyable', function() {
                const text = $(this).text().trim();
                copyToClipboard(text);
            });

            $element.on('click', '.table-preview th', function() {
                copyTableToClipboard($(this).closest('.table-preview'));
            });

            // Tooltip on hover
            $element.on('mouseenter', '.copyable', function() {
                $(this).attr('title', 'Click to copy');
            });

            $element.on('mouseleave', '.copyable', function() {
                $(this).removeAttr('title');
            });

            $element.on('mouseenter', '.table-preview th', function() {
                $(this).attr('title', 'Click to copy the entire table');
            });

            $element.on('mouseleave', '.table-preview th', function() {
                $(this).removeAttr('title');
            });
        }
    };

    async function displayData(app, visualizationId, pageSize, $container, prevColumnName, currColumnName) {
        try {
            const vis = await app.visualization.get(visualizationId);
            const updateData = async () => {
                const layout = await vis.model.getLayout();
                const requestPage = [{
                    qTop: 0,
                    qLeft: 0,
                    qWidth: layout.qHyperCube.qSize.qcx,
                    qHeight: Math.min(pageSize, layout.qHyperCube.qSize.qcy)
                }];

                const dataPage = await vis.model.getHyperCubeData('/qHyperCubeDef', requestPage);
                const headers = dataPage[0].qMatrix[0].map(cell => cell.qText.replace(/^\[|\]$/g, ''));

                const prevColumnIndex = headers.indexOf(prevColumnName);
                const currColumnIndex = headers.indexOf(currColumnName);

                const table = $('<table class="table-preview"></table>');
                const headerRow = $('<tr></tr>');

                headers.forEach(header => {
                    const th = $('<th></th>').text(header);
                    headerRow.append(th);
                });

                table.append(headerRow);

                dataPage[0].qMatrix.slice(1).forEach(row => {
                    const tr = $('<tr></tr>');
                    row.forEach((cell, index) => {
                        const td = $('<td class="copyable"></td>').text(cell.qText);

                        if (prevColumnIndex !== -1 && currColumnIndex !== -1) {
                            if (index === prevColumnIndex || index === currColumnIndex) {
                                if (row[prevColumnIndex].qText !== row[currColumnIndex].qText) {
                                    td.addClass('highlight');
                                }
                            }
                        }

                        tr.append(td);
                    });
                    table.append(tr);
                });

                $container.empty().append(table);
            };

            vis.model.on("changed", updateData);
            updateData();
        } catch (error) {
            console.error("Error displaying data:", error);
        }
    }

    function groupByColumnId(visualizations) {
        return visualizations.reduce((acc, viz) => {
            const { columnId } = viz;
            if (!acc[columnId]) {
                acc[columnId] = [];
            }
            acc[columnId].push(viz);
            return acc;
        }, {});
    }

    function copyToClipboard(text) {
        const el = document.createElement('textarea');
        el.value = text;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }

    function copyTableToClipboard($table) {
        const el = document.createElement('textarea');
        el.value = getTableText($table);
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }

    function getTableText($table) {
        let tableText = "";
        $table.find('tr').each(function(rowIndex, row) {
            $(row).find('th, td').each(function(cellIndex, cell) {
                tableText += $(cell).text().trim();
                if (cellIndex < row.children.length - 1) {
                    tableText += '\t';
                }
            });
            tableText += '\n';
        });
        return tableText;
    }
});

//css example
/* CSS styling for Qlik Sense extension */
body {
    font-family: Arial, sans-serif;
    font-size: 0.8vw; /* Smaller font size for better fit */
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    overflow: hidden;
}

.container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    height: 100vh;
    overflow-y: auto; /* Single vertical scrollbar for the container */
}

.column {
    flex: 1;
    min-width: 30%;
    max-width: 32%;
    box-sizing: border-box;
    margin: 10px; /* Margin between columns */
}

.table-container {
    margin-bottom: 10px; /* Margin between tables */
}

.table-preview {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    padding: 0.4vw; /* Smaller padding for better fit */
    text-align: left;
    border: 1px solid #ddd;
}

th {
    background-color: #f2f2f2;
    font-weight: bold;
}

tr {
    height: calc(100vh / 55); /* Ensure 50 records fit within the window size */
}

tr:hover {
    background-color: #f1f1f1; /* Highlight color on hover */
}

.highlight {
    background-color: #ffdddd; /* Highlight color for different values */
}
