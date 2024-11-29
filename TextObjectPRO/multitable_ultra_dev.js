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
                            tooltip: "Specify the visualizations to include in the extension.",
                            items: {
                                id: {
                                    type: "string",
                                    ref: "id",
                                    label: "Visualization ID",
                                    expression: "optional",
                                    tooltip: "Enter the ID of the visualization.",
                                },
                                columnId: {
                                    type: "integer",
                                    ref: "columnId",
                                    label: "Column ID",
                                    expression: "optional",
                                    defaultValue: 1,
                                    tooltip: "Assign the visualization to a specific column ID.",
                                },
                            },
                        },
                        pageSize: {
                            type: "integer",
                            ref: "pageSize",
                            label: "Page Size (records per page)",
                            defaultValue: 50,
                            expression: "optional",
                            tooltip: "Set the number of records displayed per page.",
                        },
                        css: {
                            type: "string",
                            ref: "css",
                            label: "CSS",
                            defaultValue: "",
                            expression: "optional",
                            tooltip: "Enter custom CSS for styling the extension.",
                        },
                        identifier: {
                            type: "string",
                            ref: "identifier",
                            label: "Identifier",
                            expression: "optional",
                            defaultValue: "",
                            tooltip: "Set a unique identifier for the extension's container.",
                        },
                        includeHeaders: {
                            type: "boolean",
                            ref: "includeHeaders",
                            label: "Include Headers",
                            defaultValue: true,
                            tooltip: "Toggle whether table headers are displayed.",
                        },
                        valuesToCompare: {
                            type: "items",
                            label: "Values to Compare",
                            tooltip: "Configure columns to compare values and highlight changes.",
                            items: {
                                prevColumnName: {
                                    type: "string",
                                    ref: "prevColumnName",
                                    label: "Previous Column Name",
                                    defaultValue: "Prev",
                                    tooltip: "Enter the name of the column representing previous values.",
                                },
                                currColumnName: {
                                    type: "string",
                                    ref: "currColumnName",
                                    label: "Current Column Name",
                                    defaultValue: "Curr",
                                    tooltip: "Enter the name of the column representing current values.",
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
                            tooltip: "Specify the columns where data-value attributes will be added.",
                            items: {
                                columnName: {
                                    type: "string",
                                    ref: "columnName",
                                    label: "Column Title",
                                    expression: "optional",
                                    tooltip: "The title of the column for which to add a data-value attribute.",
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
            const userCss = layout.css || "";
            const visualizations = layout.visualizations || [];
            const columnsWithDataValue = layout.columnsWithDataValue || [];
            const prevColumnName = layout.prevColumnName || "Prev";
            const currColumnName = layout.currColumnName || "Curr";
            const identifier = layout.identifier || "";
            const includeHeaders = layout.includeHeaders;

            // Define the tooltip CSS
            const tooltipCss = `
                .hover-tooltip {
                    position: absolute;
                    background: white;
                    border: 1px solid #ccc;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    padding: 10px;
                    z-index: 1000;
                    font-size: 12px;
                    display: none;
                }

                .tooltip-table {
                    border-collapse: collapse;
                    width: 100%;
                }

                .tooltip-table th, .tooltip-table td {
                    border: 1px solid #ddd;
                    padding: 5px;
                    text-align: left;
                }

                .tooltip-table th {
                    background-color: #f2f2f2;
                }
            `;

            // Combine user CSS and tooltip CSS
            const combinedCss = `<style>
                ${userCss}
                ${tooltipCss}
            </style>`;

            // Clear the element and append combined CSS
            $element.empty().append(combinedCss);

            // Create the main container
            const mainContainer = $('<div class="container ' + identifier + '"></div>');
            $element.append(mainContainer);

            // Group visualizations by columnId
            const groupedVisualizations = groupByColumnId(visualizations);

            // Iterate through each column group
            for (const columnId in groupedVisualizations) {
                const columnContainer = $('<div class="column ' + identifier + '"></div>');
                mainContainer.append(columnContainer);

                for (const viz of groupedVisualizations[columnId]) {
                    const tableContainer = $(
                        '<div class="table-container ' + identifier + '"></div>'
                    ).attr("data-grid-column-id", columnId);
                    columnContainer.append(tableContainer);
                    await displayData(
                        app,
                        viz.id,
                        layout.pageSize,
                        tableContainer,
                        prevColumnName,
                        currColumnName,
                        columnsWithDataValue,
                        identifier,
                        includeHeaders
                    );
                }
            }

            // Setup the hover tooltip
            setupHoverTooltip($element);

            // Setup copy events
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

    async function displayData(
        app,
        visualizationId,
        pageSize,
        $container,
        prevColumnName,
        currColumnName,
        columnsWithDataValue,
        identifier,
        includeHeaders
    ) {
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
                    const tr = $("<tr class='hover-row'></tr>");
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

    function setupHoverTooltip($element) {
        // Create the tooltip div
        const tooltip = $('<div class="hover-tooltip"></div>').hide();
        $("body").append(tooltip);

        // Event handlers for hover
        $element.on("mouseenter", ".hover-row", function (e) {
            const tableHtml = generateTooltipTable();
            tooltip.html(tableHtml).fadeIn(200);
            positionTooltip(e, tooltip);
        });

        $element.on("mousemove", ".hover-row", function (e) {
            positionTooltip(e, tooltip);
        });

        $element.on("mouseleave", ".hover-row", function () {
            tooltip.fadeOut(200);
        });
    }

    function generateTooltipTable() {
        let table = '<table class="tooltip-table"><thead><tr>';
        table += "<th>Column 1</th><th>Column 2</th><th>Column 3</th></tr></thead><tbody>";

        for (let i = 1; i <= 17; i++) {
            table += `<tr><td>Row ${i}</td><td>Row ${i}</td><td>Row ${i}</td></tr>`;
        }

        table += "</tbody></table>";
        return table;
    }

	function positionTooltip(e, tooltip) {
		const tooltipWidth = tooltip.outerWidth();
		const tooltipHeight = tooltip.outerHeight();
		const pageWidth = $(window).width();
		const pageHeight = $(window).height();

		let left = e.pageX + 10; // Default position to the right of the cursor
		let top = e.pageY + 10; // Default position slightly below the cursor

		// Adjust horizontal position if tooltip overflows the page width
		if (left + tooltipWidth > pageWidth) {
			left = e.pageX - tooltipWidth - 10; // Place tooltip to the left of the cursor
		}

		// Adjust vertical position if tooltip overflows the page height
		if (top + tooltipHeight > pageHeight) {
			top = pageHeight - tooltipHeight - 10; // Place tooltip so its bottom fits in the viewport
		}

		// Apply calculated positions
		tooltip.css({ top: `${top}px`, left: `${left}px` });
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
