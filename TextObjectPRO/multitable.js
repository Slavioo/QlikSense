define(["qlik", "jquery"], function(qlik, $) {
    return {
        definition: {
            type: "items",
            component: "accordion",
            items: {
                settings: {
                    uses: "settings",
                    items: {
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
                        }
                    }
                }
            }
        },
        paint: async function($element, layout) {
            const app = qlik.currApp(this);
            const css = '<style>' + layout.css + '</style>';

            const visualizations = [
                { id: "kpSSaA",  columnId: 1 },
                { id: "kTcUKt",  columnId: 2 },
                { id: "kpSSaA",  columnId: 2 },
                { id: "kTcUKt",  columnId: 2 },
                { id: "kpSSaA",  columnId: 2 },
                { id: "kTcUKt",  columnId: 3 },
                { id: "kpSSaA",  columnId: 3 },
                { id: "kpSSaA",  columnId: 3 }
            ];

            $element.empty().append(css);

            const groupedVisualizations = groupByColumnId(visualizations);

            const mainContainer = $('<div class="container"></div>');
            $element.append(mainContainer);

            for (const columnId in groupedVisualizations) {
                const columnContainer = $('<div class="column"></div>');
                mainContainer.append(columnContainer);

                for (const viz of groupedVisualizations[columnId]) {
                    const tableContainer = $('<div class="table-container"></div>')
                        .attr('data-grid-column-id', columnId);
                    columnContainer.append(tableContainer);
                    await displayData(app, viz.id, layout.pageSize, tableContainer);
                }
            }
        }
    };

    async function displayData(app, visualizationId, pageSize, $container) {
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
                const headers = await getHeaders(vis);
                const table = $('<table class="table-preview"></table>');
                const headerRow = $('<tr></tr>');

                headers.forEach(header => {
                    const th = $('<th></th>').text(header.Header);
                    headerRow.append(th);
                });

                table.append(headerRow);

                dataPage[0].qMatrix.forEach(row => {
                    const tr = $('<tr></tr>');
                    row.forEach(cell => {
                        const td = $('<td></td>').text(cell.qText);
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

    async function getHeaders(vis) {
        const dimensionHeaders = vis.model.layout.qHyperCube.qDimensionInfo.map((dim, id) => ({
            Id: id,
            Header: dim.qFallbackTitle
        }));
        const measureHeaders = vis.model.layout.qHyperCube.qMeasureInfo.map((measure, id) => ({
            Id: id + dimensionHeaders.length,
            Header: measure.qFallbackTitle
        }));
        return dimensionHeaders.concat(measureHeaders).sort((a, b) => a.Id - b.Id);
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
});

/css example
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

.highlight td:nth-child(2),
.highlight td:nth-child(3) {
    background-color: #ffdddd; /* Highlight color for different values */
}
