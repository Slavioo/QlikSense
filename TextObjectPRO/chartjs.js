define(["qlik", "https://cdn.jsdelivr.net/npm/chart.js"], function (qlik, Chart) {
    "use strict";

    return {
        initialProperties: {
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [{
                    qWidth: 10,
                    qHeight: 100
                }]
            }
        },

        definition: {
            type: "items",
            component: "accordion",
            items: {
                data: {
                    uses: "data",
                    items: {
                        dimensions: {
                            uses: "dimensions",
                            min: 1,
                        },
                        measures: {
                            uses: "measures",
                            min: 1,
                        },
                    },
                },
                settings: {
                    uses: "settings",
                    items: {
                        chartType: {
                            type: "string",
                            component: "dropdown",
                            label: "Chart Type",
                            ref: "chartType",
                            options: [
                                { value: "line", label: "Line Chart" },
                                { value: "bar", label: "Bar Chart" },
                                { value: "radar", label: "Radar Chart" },
                                { value: "polarArea", label: "Polar Area Chart" },
                                { value: "pie", label: "Pie Chart" },
                                { value: "doughnut", label: "Doughnut Chart" },
                                { value: "scatter", label: "Scatter Chart" },
                                { value: "bubble", label: "Bubble Chart" }
                            ],
                            defaultValue: "line"
                        },
                        chartOptions: {
                            type: "items",
                            label: "Chart Options",
                            items: {
                                responsive: {
                                    type: "boolean",
                                    ref: "chartOptions.responsive",
                                    label: "Responsive",
                                    defaultValue: true
                                },
                                legendPosition: {
                                    type: "string",
                                    component: "dropdown",
                                    ref: "chartOptions.plugins.legend.position",
                                    label: "Legend Position",
                                    options: [
                                        { value: "top", label: "Top" },
                                        { value: "left", label: "Left" },
                                        { value: "right", label: "Right" },
                                        { value: "bottom", label: "Bottom" }
                                    ],
                                    defaultValue: "top"
                                },
                                beginAtZero: {
                                    type: "boolean",
                                    ref: "chartOptions.scales.y.beginAtZero",
                                    label: "Begin at Zero",
                                    defaultValue: true
                                },
                                datasetColors: {
                                    type: "array",
                                    ref: "chartOptions.datasetColors",
                                    label: "Dataset Colors",
                                    itemTitleRef: "label",
                                    allowAdd: true,
                                    allowRemove: true,
                                    addTranslation: "Add Dataset Color",
                                    items: {
                                        label: {
                                            type: "string",
                                            ref: "label",
                                            label: "Dataset Label",
                                            defaultValue: "Dataset"
                                        },
                                        backgroundColor: {
                                            type: "string",
                                            ref: "backgroundColor",
                                            label: "Background Color",
                                            defaultValue: "rgba(75, 192, 192, 0.2)"
                                        },
                                        borderColor: {
                                            type: "string",
                                            ref: "borderColor",
                                            label: "Border Color",
                                            defaultValue: "rgba(75, 192, 192, 1)"
                                        },
                                        borderWidth: {
                                            type: "number",
                                            ref: "borderWidth",
                                            label: "Border Width",
                                            defaultValue: 1
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },

        paint: function ($element, layout) {
            const chartType = layout.chartType || "line";
            const qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
            const dimensions = layout.qHyperCube.qDimensionInfo;
            const measures = layout.qHyperCube.qMeasureInfo;

            // Prepare data for Chart.js
            const labels = qMatrix.map(row => row[0].qText); // First column as labels.
            const datasetColors = layout.chartOptions.datasetColors || [];

            const datasets = measures.map((measure, index) => {
                const colorSettings = datasetColors[index] || {};
                return {
                    label: measure.qFallbackTitle,
                    data: qMatrix.map(row => row[index + 1].qNum),
                    backgroundColor: colorSettings.backgroundColor || "rgba(75, 192, 192, 0.2)",
                    borderColor: colorSettings.borderColor || "rgba(75, 192, 192, 1)",
                    borderWidth: colorSettings.borderWidth || 1
                };
            });

            // Clear and render chart
            $element.empty();
            const canvas = document.createElement("canvas");
            $element.append(canvas);
            const ctx = canvas.getContext("2d");

            new Chart(ctx, {
                type: chartType,
                data: {
                    labels,
                    datasets
                },
                options: layout.chartOptions
            });
        }
    };
});
