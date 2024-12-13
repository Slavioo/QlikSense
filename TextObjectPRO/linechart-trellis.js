define(["qlik", "jquery", "https://cdn.jsdelivr.net/npm/chart.js"], function (qlik, $, Chart) {
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
                        },
                        css: {
                            type: "string",
                            ref: "css",
                            label: "Custom CSS",
                            defaultValue: "",
                            expression: "optional"
                        },
                        pageSize: {
                            type: "integer",
                            ref: "pageSize",
                            label: "Page Size (records per page)",
                            defaultValue: 50,
                            expression: "optional"
                        },
                        measureStyles: {
                            type: "array",
                            ref: "measureStyles",
                            label: "Measure Styles",
                            itemTitleRef: "label",
                            allowAdd: true,
                            allowRemove: true,
                            addTranslation: "Add Measure Style",
                            items: {
                                label: {
                                    type: "string",
                                    ref: "label",
                                    label: "Measure Label",
                                    expression: "optional"
                                },
                                borderColor: {
                                    type: "string",
                                    ref: "borderColor",
                                    label: "Border Color",
                                    defaultValue: "rgba(75, 192, 192, 1)",
                                    expression: "optional"
                                },
                                backgroundColor: {
                                    type: "string",
                                    ref: "backgroundColor",
                                    label: "Background Color",
                                    defaultValue: "rgba(75, 192, 192, 0.2)",
                                    expression: "optional"
                                },
                                pointBackgroundColor: {
                                    type: "string",
                                    ref: "pointBackgroundColor",
                                    label: "Point Background Color",
                                    defaultValue: "#fff",
                                    expression: "optional"
                                },
                                pointBorderColor: {
                                    type: "string",
                                    ref: "pointBorderColor",
                                    label: "Point Border Color",
                                    defaultValue: "rgba(75, 192, 192, 1)",
                                    expression: "optional"
                                },
                                pointBorderWidth: {
                                    type: "integer",
                                    ref: "pointBorderWidth",
                                    label: "Point Border Width",
                                    defaultValue: 2,
                                    expression: "optional"
                                },
                                pointRadius: {
                                    type: "integer",
                                    ref: "pointRadius",
                                    label: "Point Radius",
                                    defaultValue: 5,
                                    expression: "optional"
                                },
                                fill: {
                                    type: "boolean",
                                    ref: "fill",
                                    label: "Fill Area",
                                    defaultValue: true,
                                    expression: "optional"
                                },
                                tension: {
                                    type: "number",
                                    ref: "tension",
                                    label: "Line Tension",
                                    defaultValue: 0.3,
                                    expression: "optional"
                                }
                            }
                        }
                    }
                }
            }
        },
        paint: async function ($element, layout) {
            const app = qlik.currApp(this);
            const css = layout.css ? `<style>${layout.css}</style>` : "";
            const visualizationId = layout.visualizationId;
            const measureStyles = layout.measureStyles || [];

            $element.empty().append(css);

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
                            qHeight: Math.min(pageSize, totalRows - row)
                        }
                    ];
                    const pageData = await model.getHyperCubeData("/qHyperCubeDef", requestPage);
                    allData.push(...pageData[0].qMatrix);
                }

                return allData;
            };

            const renderChartTrellis = async () => {
                const vis = await app.visualization.get(visualizationId);
                const visLayout = await vis.model.getLayout();

                const pageSize = layout.pageSize || 50;
                const dataMatrix = await fetchAllPages(vis.model, pageSize);

                const headers = visLayout.qHyperCube.qDimensionInfo.slice(1).map(dim => dim.qFallbackTitle)
                    .concat(visLayout.qHyperCube.qMeasureInfo.map(meas => meas.qFallbackTitle));
                const groupedRows = dataMatrix.reduce((groups, row) => {
                    const groupKey = row[0].qText;
                    if (!groups[groupKey]) groups[groupKey] = [];
                    groups[groupKey].push(row.slice(1).map(cell => cell.qText || null));
                    return groups;
                }, {});

                $element.find('.trellis-container').remove();

                $element.append('<div class="trellis-container"></div>');
                const container = $element.find('.trellis-container');

                Object.keys(groupedRows).forEach(groupKey => {
                    const groupData = groupedRows[groupKey];
                    if (groupData.length === 0) return;

                    const xAxis = groupData.map(row => row[0]);
                    const datasets = headers.slice(1).map((header, index) => {
                        const style = measureStyles[index] || {};
                        return {
                            label: header,
                            data: groupData.map(row => row[index + 1] || null),
                            borderColor: style.borderColor || `rgba(${(index * 75) % 255}, ${(index * 50) % 255}, ${(index * 25) % 255}, 1)`,
                            backgroundColor: style.backgroundColor || `rgba(${(index * 75) % 255}, ${(index * 50) % 255}, ${(index * 25) % 255}, 0.2)`,
                            pointBackgroundColor: style.pointBackgroundColor || "#fff",
                            pointBorderColor: style.pointBorderColor || `rgba(${(index * 75) % 255}, ${(index * 50) % 255}, ${(index * 25) % 255}, 1)`,
                            pointBorderWidth: style.pointBorderWidth || 2,
                            pointRadius: style.pointRadius || 5,
                            fill: style.fill !== undefined ? style.fill : true,
                            tension: style.tension || 0.3
                        };
                    });

                    const chartContainer = $(`<div class="chart-card" style="height: 200px; overflow: hidden;"> <!-- Adjust the height as needed --> <div class="group-title">${groupKey}</div><canvas></canvas></div>`);

                    container.append(chartContainer);
                    const ctx = chartContainer.find('canvas')[0].getContext('2d');

                    new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: xAxis,
                            datasets: datasets
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'top'
                                },
                                tooltip: {
                                    mode: 'index',
                                    intersect: false
                                }
                            },
                            scales: {
                                x: {
                                    grid: {
                                        display: true,
                                        drawBorder: true,
                                        color: 'rgba(0, 0, 0, 0.1)'
                                    },
                                    title: {
                                        display: true,
                                        text: headers[0],
                                        font: {
                                            size: 16,
                                            weight: 'bold'
                                        },
                                        padding: 15
                                    }
                                },
                                y: {
                                    beginAtZero: false,
                                    grid: {
                                        display: true,
                                        drawBorder: true,
                                        color: 'rgba(0, 0, 0, 0.1)'
                                    },
                                    title: {
                                        display: true,
                                        text: 'Values',
                                        font: {
                                            size: 16,
                                            weight: 'bold'
                                        },
                                        padding: 15
                                    }
                                }
                            }
                        }
                    });
                });
            };

            renderChartTrellis();

            const vis = await app.visualization.get(visualizationId);
            vis.model.on('changed', renderChartTrellis);
        }
    };
});

//css
.trellis-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* Adjust columns as needed */
    grid-gap: 16px;
    width: 100%;
    max-width: 100%; /* Ensure no horizontal overflow */
    height: 100%;
    padding: 16px;
    overflow-y: auto;
    overflow-x: hidden; /* Prevent horizontal scrolling */
    font-family: Arial, sans-serif;
    box-sizing: border-box;
}

.chart-card {
    border: 1px solid #ddd;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 8px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box; /* Include padding and borders in dimensions */
}

.group-title {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 8px;
    color: #34495e;
    text-align: left;
    letter-spacing: 0.5px;
}
