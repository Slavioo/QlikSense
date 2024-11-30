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

            const renderTableTrellis = async () => {
                const vis = await app.visualization.get(visualizationId);
                const visLayout = await vis.model.getLayout();

                // Fetch all rows from the hypercube
                const totalRows = visLayout.qHyperCube.qSize.qcy;
                const requestPage = [
                    {
                        qTop: 0,
                        qLeft: 0,
                        qWidth: visLayout.qHyperCube.qSize.qcx,
                        qHeight: totalRows // Fetch all rows
                    }
                ];
                const dataPage = await vis.model.getHyperCubeData("/qHyperCubeDef", requestPage);

                const headers = visLayout.qHyperCube.qDimensionInfo.slice(1).map(dim => dim.qFallbackTitle)
                    .concat(visLayout.qHyperCube.qMeasureInfo.map(meas => meas.qFallbackTitle));
                const groupedRows = dataPage[0].qMatrix.reduce((groups, row) => {
                    const groupKey = row[0].qText; // Use the first column as the group key
                    if (!groups[groupKey]) groups[groupKey] = [];
                    groups[groupKey].push(row.slice(1).map(cell => cell.qText || "-")); // Exclude first column
                    return groups;
                }, {});

                const html = `
                    <style>
                        .trellis-container {
                            display: grid;
                            grid-template-columns: repeat(2, 1fr);
                            grid-gap: 16px;
                            width: 100%;
                            height: 100%;
                            padding: 16px;
                            overflow-y: auto; /* Vertical scrollbar for the container */
                            font-family: Arial, sans-serif;
                            box-sizing: border-box;
                        }

                        .table-card {
                            border: 1px solid #ddd;
                            border-radius: 4px;
                            background-color: #fff;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                            padding: 10px;
                        }

                        table {
                            width: 100%;
                            border-collapse: collapse;
                            font-size: 14px;
                        }

                        table thead th {
                            text-align: left;
                            background-color: #f4f4f4;
                            font-weight: bold;
                            border-bottom: 2px solid #ddd;
                            padding: 8px;
                        }

                        table tbody td {
                            padding: 8px;
                            border-bottom: 1px solid #ddd;
                        }

                        table tbody tr:last-child td {
                            border-bottom: none;
                        }

                        table tbody tr:hover {
                            background-color: #f9f9f9;
                        }

                        .group-title {
                            font-weight: bold;
                            font-size: 16px;
                            margin-bottom: 8px;
                            color: #0078d4;
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
            vis.model.on('changed', renderTableTrellis);
        }
    };
});
