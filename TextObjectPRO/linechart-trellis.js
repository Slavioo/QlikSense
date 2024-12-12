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
                            expression: "optional",
                        },
                        pageSize: {
                            type: "integer",
                            ref: "pageSize",
                            label: "Page Size (records per page)",
                            defaultValue: 50,
                            expression: "optional",
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
            const css = layout.css ? "<style>" + layout.css + "</style>" : ""; // Apply custom CSS from settings
            const visualizationId = layout.visualizationId;

            $element.empty().append(css); // Inject custom CSS into the DOM

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

			const renderChartTrellis = async () => {
				const vis = await app.visualization.get(visualizationId);
				const visLayout = await vis.model.getLayout();

				const pageSize = layout.pageSize || 50; // Define the page size from the settings panel
				const dataMatrix = await fetchAllPages(vis.model, pageSize);

				const headers = visLayout.qHyperCube.qDimensionInfo.slice(1).map(dim => dim.qFallbackTitle)
					.concat(visLayout.qHyperCube.qMeasureInfo.map(meas => meas.qFallbackTitle));
				const groupedRows = dataMatrix.reduce((groups, row) => {
					const groupKey = row[0].qText; // Use the first column as the group key
					if (!groups[groupKey]) groups[groupKey] = [];
					groups[groupKey].push(row.slice(1).map(cell => cell.qText || null)); // Handle null or undefined values
					return groups;
				}, {});

				// Clear the container before appending new elements
				$element.find('.trellis-container').remove();

				// Prepare all chart elements in memory
				const chartElements = Object.keys(groupedRows).map(groupKey => {
					const groupData = groupedRows[groupKey];
					if (groupData.length === 0) return null; // Skip rendering empty groups

					const xAxis = groupData.map(row => row[0]); // First column in the group as X-axis
					const datasets = headers.slice(1).map((header, index) => ({
						label: header,
						data: groupData.map(row => row[index + 1] || null), // Handle missing data gracefully
						borderColor: `hsl(${(index * 50) % 360}, 70%, 50%)`,
						backgroundColor: `hsl(${(index * 50) % 360}, 70%, 70%)`,
						tension: 0.4,
					}));

					return {
						groupKey,
						xAxis,
						datasets
					};
				}).filter(chart => chart !== null); // Remove null entries for empty groups

				// Append the container only once all chart elements are ready
				$element.append('<div class="trellis-container"></div>');
				const container = $element.find('.trellis-container');

				chartElements.forEach(({ groupKey, xAxis, datasets }) => {
					const chartContainer = $(`<div class="chart-card">
						<div class="group-title">${groupKey}</div>
						<canvas></canvas>
					</div>`);

					container.append(chartContainer);
					const ctx = chartContainer.find('canvas')[0].getContext('2d');

					// Render the chart
					new Chart(ctx, {
						type: 'line',
						data: {
							labels: xAxis,
							datasets: datasets,
						},
						options: {
							responsive: true,
							plugins: {
								legend: {
									position: 'top',
								},
								tooltip: {
									mode: 'index',
									intersect: false,
								}
							},
							interaction: {
								mode: 'nearest',
								axis: 'x',
								intersect: false,
							},
							scales: {
								x: {
									title: {
										display: true,
										text: headers[0],
									},
								},
								y: {
									title: {
										display: true,
										text: 'Values',
									},
									beginAtZero: true,
								}
							}
						}
					});
				});
			};

            renderChartTrellis();

            const vis = await app.visualization.get(visualizationId);
            vis.model.on('changed', renderChartTrellis); // Update the chart when the visualization changes
        },
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
