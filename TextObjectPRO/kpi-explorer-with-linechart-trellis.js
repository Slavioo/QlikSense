define(["qlik", "https://cdn.jsdelivr.net/npm/chart.js@4.4.6"], function (qlik, Chart) {
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
                            expression: "optional",
                        },
                        chartVisualizationId: {
                            type: "string",
                            ref: "chartVisualizationId",
                            label: "Chart Visualization ID",
                            expression: "optional",
                        },
                        pageSize: {
                            type: "integer",
                            ref: "pageSize",
                            label: "Page Size (records per page)",
                            defaultValue: 50,
                            expression: "optional",
                        },
                        selectInField: {
                            type: "string",
                            ref: "selectInField",
                            label: "Select in Field on hover or click",
                            expression: "optional",
                        },
                        numberOfCards: {
                            type: "integer",
                            ref: "numberOfCards",
                            label: "Number of Cards",
                            defaultValue: 6,
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
            const visualizationId = layout.visualizationId;
            const chartVisualizationId = layout.chartVisualizationId;
            const pageSize = layout.pageSize || 50;
            const selectInField = layout.selectInField;
            const numberOfCards = layout.numberOfCards || 6;

            let isHovering = false;
            let isCursorOutside = true;
            let lockedTitle = null;

            // Function to get headers from the chart visualization
            const getHeaders = (layout) => {
                const columnOrder = layout.qHyperCube.qColumnOrder;
                const dimensions = layout.qHyperCube.qDimensionInfo.map((dim) => dim.qFallbackTitle);
                const measures = layout.qHyperCube.qMeasureInfo.map((meas) => meas.qFallbackTitle);
                const allHeaders = [...dimensions, ...measures];
                return columnOrder.map((idx) => allHeaders[idx]);
            };

            const renderKpiCards = async () => {
                const vis = await app.visualization.get(visualizationId);
                const layout = await vis.model.getLayout();

                const requestPage = [
                    {
                        qTop: 0,
                        qLeft: 0,
                        qWidth: layout.qHyperCube.qSize.qcx,
                        qHeight: Math.min(pageSize, layout.qHyperCube.qSize.qcy),
                    },
                ];

                const dataPage = await vis.model.getHyperCubeData("/qHyperCubeDef", requestPage);

                const kpiData = dataPage[0].qMatrix.map((row) => ({
                    Title: row[0].qText,
                    Value: row[1].qText,
                    Description: row[2]?.qText || "Description",
                    Color: row[3]?.qText || "#0078d4",
                }));

                const chartVis = await app.visualization.get(chartVisualizationId);
                const chartLayout = await chartVis.model.getLayout();
                const chartHeaders = getHeaders(chartLayout);
                const chartData = await chartVis.model.getHyperCubeData("/qHyperCubeDef", [
                    {
                        qTop: 0,
                        qLeft: 0,
                        qWidth: chartLayout.qHyperCube.qSize.qcx,
                        qHeight: chartLayout.qHyperCube.qSize.qcy,
                    },
                ]);
                const chartMatrix = chartData[0].qMatrix;
                const chartLabels = chartMatrix.map((row) => row[0].qText);

                const html = `
                    <style>
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }

                        .kpi-container {
                            display: grid;
                            grid-template-columns: repeat(${numberOfCards}, 1fr);
                            grid-gap: 4px;
                            width: 100%;
                            height: 100%;
                            padding: 16px;
                            overflow-y: auto;
                            overflow-x: hidden;
                        }

                        .kpi-card {
                            background-color: #ffffff;
                            border-radius: 4px;
                            box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
                            padding: 4px;
                            text-align: center;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            align-items: center;
                            cursor: pointer;
                            transition: box-shadow 0.3s ease;
                        }

                        .kpi-card:hover {
                            box-shadow: 0 6px 6px rgba(0, 0, 0, 0.2);
                        }

                        .kpi-card.selected {
                            background-color: rgba(0, 120, 212, 0.1);
                        }

                        .kpi-title {
                            font-size: 1.2em;
                            font-weight: bold;
                            color: #333333;
                        }

                        .kpi-value {
                            font-size: 2em;
                            font-weight: bold;
                            margin: 4px 0;
                            color: inherit;
                        }

                        .kpi-description {
                            font-size: 1em;
                            color: #777777;
                        }

                        .chart-container {
                            width: 90%;
                            height: 50%;
                        }

                        canvas {
                            display: block;
                        }
                    </style>
                    <div class="kpi-container">
                        ${kpiData
                            .map(
                                (kpi) => `
                            <div class="kpi-card" style="color: ${kpi.Color}" data-title="${kpi.Title}">
                                <div class="kpi-title">${kpi.Title}</div>
                                <div class="kpi-value">${kpi.Value}</div>
                                <div class="kpi-description">${kpi.Description}</div>
                                <div class="chart-container">
                                    <canvas id="chart-${kpi.Title.replace(/\s/g, '')}"></canvas>
                                </div>
                            </div>
                        `
                            )
                            .join("")}
                    </div>
                `;

                $element.html(html);

                const cards = $element.find(".kpi-card");

                if (lockedTitle) {
                    cards.filter(`[data-title="${lockedTitle}"]`).addClass("selected");
                }

                cards.each(function () {
                    const card = $(this);
                    const title = card.data("title");

                    card.hover(
                        function () {
                            if (selectInField && !lockedTitle) {
                                app.field(selectInField).selectMatch(title, false);
                            }
                        },
                        function () {
                            if (selectInField && !lockedTitle) {
                                app.field(selectInField).clear();
                            }
                        }
                    );

                    card.click(function () {
                        if (lockedTitle === title) {
                            lockedTitle = null;
                            if (selectInField) {
                                app.field(selectInField).clear();
                            }
                            cards.removeClass("selected");
                        } else {
                            lockedTitle = title;
                            if (selectInField) {
                                app.field(selectInField).selectMatch(title, false);
                            }
                            cards.removeClass("selected");
                            card.addClass("selected");
                        }
                    });
                });

                // Create charts for each KPI
                kpiData.forEach((kpi) => {
                    const chartIndices = chartHeaders
                        .map((header, idx) => {
                            if (idx === 0) return -1; // Skip the first column
                            const headerTitle = header.split("{")[0].trim();
                            return headerTitle === kpi.Title ? idx : -1;
                        })
                        .filter((idx) => idx !== -1);

                    if (chartIndices.length === 0) return;

                    const chartValues = chartIndices.map((chartIndex) =>
                        chartMatrix.map((row) => row[chartIndex]?.qNum || null)
                    );
                    const colors = chartIndices.map((_, index) => {
                        const transparency = 1 - index * 0.4;
                        return `${kpi.Color}${Math.floor(transparency * 255)
                            .toString(16)
                            .padStart(2, "0")}`;
                    });

                    const ctx = document.getElementById(`chart-${kpi.Title.replace(/\s/g, "")}`).getContext("2d");
                    const datasets = chartValues.map((values, index) => ({
                        label: chartHeaders[chartIndices[index]].match(/\{([^}]+)\}/)?.[1] || kpi.Title,
                        data: values,
                        borderColor: colors[index],
                        backgroundColor: `${colors[index]}1A`,
                        borderWidth: 2,
                        pointRadius: 3,
                        pointBackgroundColor: "#fff",
                        pointBorderColor: colors[index],
                        tension: 0.3,
                    }));

                    new Chart(ctx, {
                        type: "line",
                        data: {
                            labels: chartLabels,
                            datasets: datasets,
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: true,
                                    position: "bottom",
                                    labels: {
                                        usePointStyle: true,
                                        boxWidth: 10,
                                        boxHeight: 10,
                                    },
                                },
                            },
                            scales: {
                                x: {
                                    grid: { display: false },
                                },
                                y: {
                                    beginAtZero: true,
                                    grid: {
                                        color: "#e0e0e0",
                                        lineWidth: 0.5,
                                    },
                                },
                            },
                        },
                    });
                });
            };

            renderKpiCards();

            const vis = await app.visualization.get(visualizationId);
            const handleLayoutChange = async () => {
                if (!isHovering && isCursorOutside) {
                    renderKpiCards();
                }
            };

            vis.model.on("changed", handleLayoutChange);

            $element.on("mouseenter", () => {
                isHovering = true;
            });

            $element.on("mouseleave", () => {
                isHovering = false;
                setTimeout(() => {
                    if (isCursorOutside) {
                        renderKpiCards();
                    }
                }, 50);
            });

            $element.on("mouseenter", () => {
                isCursorOutside = false;
            });

            $element.on("mouseleave", () => {
                isCursorOutside = true;
            });
        },
    };
});
