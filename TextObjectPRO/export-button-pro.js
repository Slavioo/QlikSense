define(["qlik", "jquery"], function(qlik, $) {
    'use strict';

    return {
        definition: {
            type: "items",
            component: "accordion",
            items: {
                settings: {
                    uses: "settings",
                    items: {
                        fieldName: {
                            type: "string",
                            ref: "props.fieldName",
                            label: "Field Name",
                            defaultValue: ""
                        },
                        chunkSize: {
                            type: "integer",
                            ref: "props.chunkSize",
                            label: "Chunk Size",
                            defaultValue: 5
                        },
                        visualizationId: {
                            type: "string",
                            ref: "props.visualizationId",
                            label: "Visualization ID",
                            defaultValue: ""
                        }
                    }
                }
            }
        },
        paint: function($element, layout) {
            const app = qlik.currApp(this);
            const $button = $('<button>Start Chunk Filter and Export</button>');
            let intervalId;
            let currentChunk = 0; // Start with 1 to avoid negative intervals
            let totalValues;

            app.createList({
                "qDef": {
                    "qFieldDefs": [layout.props.fieldName]
                },
                "qInitialDataFetch": [{
                    qWidth: 1,
                    qHeight: 10000
                }]
            }, function(reply) {
                totalValues = reply.qListObject.qDataPages[0].qMatrix.length;
            });

            const updateButtonText = () => {
                const startValue = (currentChunk - 1) * layout.props.chunkSize + 1;
                const endValue = Math.min(currentChunk * layout.props.chunkSize, totalValues);
                $button.text(`Apply Chunk Filter and Export (${startValue}-${endValue})`);
            };

            $button.on('click', function() {
                const { fieldName, chunkSize, visualizationId } = layout.props;
                if (fieldName && totalValues && visualizationId) {
                    if (intervalId) {
                        clearInterval(intervalId); // Clear previous interval if button is clicked again
                    }
                    intervalId = setInterval(function() {
                        if ((currentChunk - 1) * chunkSize >= totalValues) {
                            clearInterval(intervalId); // Stop if all values have been filtered
                            console.log("All values have been filtered and exported.");
                            return;
                        }
                        const filterExpression = `=rowno(total)>=${(currentChunk - 1) * chunkSize + 1} and rowno(total)<=${Math.min(currentChunk * chunkSize, totalValues)}`;
                        try {
                            const field = app.field(fieldName);
                            field.clear(); // Clear any existing selections
                            field.selectMatch(filterExpression, false);
                            updateButtonText();
                            console.log(`Chunk filter applied to ${fieldName}: Rows ${(currentChunk - 1) * chunkSize + 1} to ${Math.min(currentChunk * chunkSize, totalValues)}`);

                            // Export data after applying the filter
                            app.visualization.get(visualizationId).then(function(vis) {
                                vis.exportData().then(function(data) {
                                    const csvFile = new Blob([data], {type: "text/csv"});
                                    const downloadLink = document.createElement("a");
                                    downloadLink.download = `data_chunk_${currentChunk}.csv`;
                                    downloadLink.href = window.URL.createObjectURL(csvFile);
                                    downloadLink.style.display = "none";
                                    document.body.appendChild(downloadLink);
                                    downloadLink.click();
                                });
                            });
                        } catch (error) {
                            console.error("Error applying chunk filter or exporting data:", error.message);
                        }
                        currentChunk++; // Increment after applying the filter and exporting data
                    }, 5000); // Update filter and export data every 5 seconds
                    updateButtonText();
                } else {
                    console.error("Please provide a field name, ensure the field has values, and provide a visualization ID.");
                }
            });

            $element.empty();
            $element.append($button);
        }
    };
});
