define(["qlik", "jquery"], function (qlik, $) {
    return {
        definition: {
            type: "items",
            component: "accordion",
            items: {
                settings: {
                    uses: "settings",
                    items: {
                        visualizationId: {
                            type: "string",
                            ref: "visualizationId",
                            label: "Visualization ID",
                            expression: "optional"
                        }
                    }
                }
            }
        },
        support: {
            exportData: false
        },
        paint: async function ($element, layout) {
            const app = qlik.currApp(this);
            const visualizationId = layout.visualizationId;

            const fetchAllPages = async (model, pageSize) => {
                const totalRows = model.layout.qHyperCube.qSize.qcy;
                const totalCols = model.layout.qHyperCube.qSize.qcx;
                const allData = [];

                for (let row = 0; row < totalRows; row += pageSize) {
                    const requestPage = [
                        {
                            qTop: row,
                            qLeft: 0,
                            qWidth: totalCols,
                            qHeight: Math.min(pageSize, totalRows - row),
                        },
                    ];
                    const pageData = await model.getHyperCubeData("/qHyperCubeDef", requestPage);
                    allData.push(...pageData[0].qMatrix);
                }

                return allData;
            };

            const renderTableTrellis = async () => {
                const vis = await app.visualization.get(visualizationId);
                const visLayout = await vis.model.getLayout();

                const pageSize = 50; // Define the page size
                const dataMatrix = await fetchAllPages(vis.model, pageSize);

                const headers = visLayout.qHyperCube.qDimensionInfo.slice(1).map(dim => dim.qFallbackTitle)
                    .concat(visLayout.qHyperCube.qMeasureInfo.map(meas => meas.qFallbackTitle));
                const groupedRows = dataMatrix.reduce((groups, row) => {
                    const groupKey = row[0].qText; // Use the first column as the group key
                    if (!groups[groupKey]) groups[groupKey] = [];
                    groups[groupKey].push(row.slice(1).map(cell => cell.qText || "-")); // Exclude first column
                    return groups;
                }, {});

                const html = `
                    <style>
                        .trellis-container {
                            display: grid;
                            grid-template-columns: repeat(3, 1fr); /* 3 tables per row */
                            grid-gap: 8px;
                            width: 100%;
                            height: 100%;
                            padding: 8px;
                            overflow-y: auto; /* Vertical scrollbar for the container */
                            font-family: Arial, sans-serif;
                            box-sizing: border-box;
                        }

                        .table-card {
                            border: 1px solid #aaa;
                            background-color: #f9f9f9;
                            padding: 5px;
                        }

                        table {
                            width: 100%;
                            border-collapse: collapse;
                            font-size: 12px;
                        }

                        table thead th {
                            text-align: left;
                            background-color: #e0e0e0;
                            font-weight: bold;
                            border-bottom: 1px solid #aaa;
                            padding: 4px;
                        }

                        table tbody td {
                            padding: 4px;
                            border-bottom: 1px solid #ddd;
                        }

                        table tbody tr:last-child td {
                            border-bottom: none;
                        }

                        table tbody tr:hover {
                            background-color: #f1f1f1;
                        }

                        .group-title {
                            font-weight: bold;
                            font-size: 14px;
                            margin-bottom: 4px;
                            color: #333;
                            text-align: left;
                        }
                    </style>
                    <div class="trellis-container">
                        ${Object.keys(groupedRows).map(groupKey => `
                            <div class="table-card">
                                <div class="group-title">${groupKey}</div>
                                <table>
                                    <thead>
                                        <tr>
                                            ${headers.map(header => `<th>${header}</th>`).join('')}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${groupedRows[groupKey].map(row => `
                                            <tr>
                                                ${row.map(cell => `<td>${cell}</td>`).join('')}
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        `).join('')}
                    </div>
                `;

                $element.html(html);
            };

            renderTableTrellis();

            const vis = await app.visualization.get(visualizationId);
            vis.model.on("changed", renderTableTrellis);
        }
    };
});
