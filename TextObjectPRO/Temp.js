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
                        }
                    }
                }
            }
        },
        paint: function($element, layout) {
            const app = qlik.currApp(this);
            const $button = $('<button>Start Chunk Filter</button>');
            let intervalId;
            let currentChunk = 0;

            const updateButtonText = () => {
                const startValue = (currentChunk - 1) * layout.props.chunkSize + 1;
                const endValue = currentChunk * layout.props.chunkSize;
                $button.text(`Apply Chunk Filter (${startValue}-${endValue})`);
            };

            const applyFilter = () => {
                const { fieldName, chunkSize } = layout.props;
                const startValue = (currentChunk - 1) * chunkSize + 1;
                const endValue = currentChunk * chunkSize;
                const filterExpression = `=rowno(total)>=${startValue} and rowno(total)<=${endValue}`;
                try {
                    const field = app.field(fieldName);
                    field.selectMatch(filterExpression, false);
                    updateButtonText();
                    console.log(`Chunk filter applied to ${fieldName}: Rows ${startValue} to ${endValue}`);
                } catch (error) {
                    console.error("Error applying chunk filter:", error.message);
                }
            };

            $button.on('click', function() {
                if (intervalId) {
                    clearInterval(intervalId); // Clear previous interval if button is clicked again
                }
                applyFilter(); // Apply filter immediately on button click
                intervalId = setInterval(function() {
                    currentChunk++;
                    applyFilter();
                    const field = app.field(layout.props.fieldName);
                    if (field.rows.length === 0) {
                        clearInterval(intervalId); // Stop when no more filtered rows
                        console.log("No more filtered rows. Stopping the chunk filter.");
                    }
                }, 5000); // Update filter every 5 seconds
            });

            $element.empty();
            $element.append($button);
        }
    };
});
