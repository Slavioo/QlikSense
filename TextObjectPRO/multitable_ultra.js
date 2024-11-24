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
                    await displayData(app, viz.id, layout.pageSize, tableContainer, prevColumnName, currColumnName, identifier, includeHeaders);
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

    async function displayData(app, visualizationId, pageSize, $container, prevColumnName, currColumnName, identifier, includeHeaders) {
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
