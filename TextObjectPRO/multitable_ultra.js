define(["qlik", "jquery"], function (qlik, $) {
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
                                    expression: "optional",
                                },
                                columnId: {
                                    type: "integer",
                                    ref: "columnId",
                                    label: "Column ID",
                                    expression: "optional",
                                    defaultValue: 1,
                                },
                            },
                        },
                        pageSize: {
                            type: "integer",
                            ref: "pageSize",
                            label: "Page Size (records per page)",
                            defaultValue: 50,
                            expression: "optional",
                        },
                        css: {
                            type: "string",
                            ref: "css",
                            label: "CSS",
                            defaultValue: "",
                            expression: "optional",
                        },
                        identifier: {
                            type: "string",
                            ref: "identifier",
                            label: "Identifier",
                            expression: "optional",
                            defaultValue: "",
                        },
                        includeHeaders: {
                            type: "boolean",
                            ref: "includeHeaders",
                            label: "Include Headers",
                            defaultValue: true,
                        },
                        valuesToCompare: {
                            type: "items",
                            label: "Values to compare",
                            items: {
                                prevColumnName: {
                                    type: "string",
                                    ref: "prevColumnName",
                                    label: "Previous Column Name",
                                    defaultValue: "Prev",
                                },
                                currColumnName: {
                                    type: "string",
                                    ref: "currColumnName",
                                    label: "Current Column Name",
                                    defaultValue: "Curr",
                                },
                            },
                        },
                        columnsWithDataValue: {
                            type: "array",
                            ref: "columnsWithDataValue",
                            label: "Columns with Data-Value",
                            itemTitleRef: "columnName",
                            allowAdd: true,
                            allowRemove: true,
                            addTranslation: "Add Column",
                            items: {
                                columnName: {
                                    type: "string",
                                    ref: "columnName",
                                    label: "Column Title",
                                    expression: "optional",
                                },
                            },
                        },
                    },
                },
            },
        },
        support: {
            exportData: false,
        },
        paint: async function ($element, layout) {
            const app = qlik.currApp(this);
            const css = "<style>" + layout.css + "</style>";
            const visualizations = layout.visualizations || [];
            const columnsWithDataValue = layout.columnsWithDataValue || [];
            const prevColumnName = layout.prevColumnName || "Prev";
            const currColumnName = layout.currColumnName || "Curr";
            const identifier = layout.identifier || "";
            const includeHeaders = layout.includeHeaders;

            $element.empty().append(css);

            const groupedVisualizations = groupByColumnId(visualizations);

            const mainContainer = $('<div class="container ' + identifier + '"></div>');
            $element.append(mainContainer);

            for (const columnId in groupedVisualizations) {
                const columnContainer = $('<div class="column ' + identifier + '"></div>');
                mainContainer.append(columnContainer);

                for (const viz of groupedVisualizations[columnId]) {
                    const tableContainer = $(
                        '<div class="table-container ' + identifier + '"></div>'
                    ).attr("data-grid-column-id", columnId);
                    columnContainer.append(tableContainer);
                    await displayData(app, viz.id, layout.pageSize, tableContainer, prevColumnName, currColumnName, columnsWithDataValue, identifier, includeHeaders);
                }
            }

            setupCopyEvents($element);
        },
    };

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

    async function displayData(app, visualizationId, pageSize, $container, prevColumnName, currColumnName, columnsWithDataValue, identifier, includeHeaders) {
        try {
            const vis = await app.visualization.get(visualizationId);

            const updateData = async () => {
                const layout = await vis.model.getLayout();
                const headers = await getHeaders(layout);

                const requestPage = [
                    {
                        qTop: 0,
                        qLeft: 0,
                        qWidth: layout.qHyperCube.qSize.qcx,
                        qHeight: Math.min(pageSize, layout.qHyperCube.qSize.qcy),
                    },
                ];

                const dataPage = await vis.model.getHyperCubeData("/qHyperCubeDef", requestPage);

                const prevColumnIndex = headers.indexOf(prevColumnName);
                const currColumnIndex = headers.indexOf(currColumnName);

                const table = $('<table class="table-preview ' + identifier + '"></table>');

                if (includeHeaders) {
                    const headerRow = $("<tr></tr>");
                    headers.forEach((header) => {
                        const th = $("<th></th>").text(header);
                        headerRow.append(th);
                    });
                    table.append(headerRow);
                }

                dataPage[0].qMatrix.forEach((row) => {
                    const tr = $("<tr></tr>");
                    row.forEach((cell, index) => {
                        const td = $('<td class="copyable"></td>').text(cell.qText);

                        if (columnsWithDataValue.some((col) => col.columnName === headers[index])) {
                            td.attr("data-value", cell.qText);
                        }

                        if (prevColumnIndex !== -1 && currColumnIndex !== -1) {
                            if (index === prevColumnIndex || index === currColumnIndex) {
                                if (row[prevColumnIndex].qText !== row[currColumnIndex].qText) {
                                    td.addClass("highlight");
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

    function getHeaders(layout) {
        const columnOrder = layout.qHyperCube.qColumnOrder;
        const dimensions = layout.qHyperCube.qDimensionInfo.map((dim) => dim.qFallbackTitle);
        const measures = layout.qHyperCube.qMeasureInfo.map((meas) => meas.qFallbackTitle);
        const allHeaders = [...dimensions, ...measures];

        return columnOrder.map((idx) => allHeaders[idx]);
    }

    function setupCopyEvents($element) {
        $element.on("click", ".copyable", function () {
            const text = $(this).text().trim();
            copyToClipboard(text);
        });

        $element.on("click", ".table-preview th", function () {
            copyTableToClipboard($(this).closest(".table-preview"));
        });

        $element.on("mouseenter", ".copyable", function () {
            $(this).attr("title", "Click to copy");
        });

        $element.on("mouseleave", ".copyable", function () {
            $(this).removeAttr("title");
        });

        $element.on("mouseenter", ".table-preview th", function () {
            $(this).attr("title", "Click to copy the entire table");
        });

        $element.on("mouseleave", ".table-preview th", function () {
            $(this).removeAttr("title");
        });
    }

    function copyToClipboard(text) {
        const el = document.createElement("textarea");
        el.value = text;
        el.setAttribute("readonly", "");
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
    }

    function copyTableToClipboard($table) {
        const el = document.createElement("textarea");
        el.value = getTableText($table);
        el.setAttribute("readonly", "");
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
    }

    function getTableText($table) {
        let tableText = "";
        $table.find("tr").each(function (rowIndex, row) {
            $(row)
                .find("th, td")
                .each(function (cellIndex, cell) {
                    tableText += $(cell).text().trim();
                    if (cellIndex < row.children.length - 1) {
                        tableText += "\t";
                    }
                });
            tableText += "\n";
        });
        return tableText;
    }
});

//CSS
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
    background-color: #f1f1f1; /* Highlight color for different values */
}

/* Define header colors for specific columnId */
.container .table-container[data-grid-column-id="1"] .table-preview th {
    background-color: #f8d7da; /* Light red */
    color: #721c24; /* Complementary text color for readability */
}

.container .table-container[data-grid-column-id="2"] .table-preview th {
    background-color: #fff3cd; /* Light yellow */
    color: #856404; /* Complementary text color for readability */
}

.container .table-container[data-grid-column-id="3"] .table-preview th {
    background-color: #d4edda; /* Light green */
    color: #155724; /* Complementary text color for readability */
}

/* Hover effect for rows */
.container .table-container[data-grid-column-id="1"] .table-preview tr:hover {
    background-color: rgba(248, 215, 218, 0.5); /* Light red with transparency */
}

.container .table-container[data-grid-column-id="2"] .table-preview tr:hover {
    background-color: rgba(255, 243, 205, 0.5); /* Light yellow with transparency */
}

.container .table-container[data-grid-column-id="3"] .table-preview tr:hover {
    background-color: rgba(212, 237, 218, 0.5); /* Light green with transparency */
}

/* Default styling for all cells with a data-value attribute */
.table-preview tr[data-value] {
    background-color: lightgrey; /* Default background color */
    color: black; /* Default text color */
    font-weight: bold;
}

.table-preview td[data-value] {
    background-color: lightgrey; /* Default background color */
    color: black; /* Default text color */
    font-weight: bold;
}

/* Specific colors for cells with certain values */
.table-preview td[data-value="Sales"] {
    background-color: lightblue;
    color: navy;
}

.table-preview td[data-value="Growth"] {
    background-color: lightgreen;
    color: darkgreen;
}

.table-preview td[data-value="Efficiency"] {
    background-color: lightyellow;
    color: goldenrod;
}

.table-preview td[data-value="Satisfaction"] {
    background-color: lightcoral;
    color: maroon;
}
