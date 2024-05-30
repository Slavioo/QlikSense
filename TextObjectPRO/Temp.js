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
            let currentChunk = 1; // Start with 1 to avoid negative intervals

            const updateButtonText = () => {
                const startValue = (currentChunk - 1) * layout.props.chunkSize + 1;
                const endValue = currentChunk * layout.props.chunkSize;
                $button.text(`Apply Chunk Filter (${startValue}-${endValue})`);
            };

            $button.on('click', function() {
                const { fieldName, chunkSize } = layout.props;
                if (fieldName) {
                    if (intervalId) {
                        clearInterval(intervalId); // Clear previous interval if button is clicked again
                    }
                    intervalId = setInterval(function() {
                        const filterExpression = `=rowno(total)>=${(currentChunk - 1) * chunkSize + 1} and rowno(total)<=${currentChunk * chunkSize}`;
                        try {
                            const field = app.field(fieldName);
                            field.clear(); // Clear any existing selections
                            field.selectMatch(filterExpression, false);
                            updateButtonText();
                            console.log(`Chunk filter applied to ${fieldName}: Rows ${(currentChunk - 1) * chunkSize + 1} to ${currentChunk * chunkSize}`);
                        } catch (error) {
                            console.error("Error applying chunk filter:", error.message);
                        }
                        currentChunk++; // Increment after applying the filter
                    }, 5000); // Update filter every 5 seconds
                    updateButtonText();
                } else {
                    console.error("Please provide a field name.");
                }
            });

            $element.empty();
            $element.append($button);
        }
    };
});
