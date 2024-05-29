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
            const $button = $('<button>Apply Chunk Filter</button>');

            $button.on('click', function() {
                const { fieldName, chunkSize } = layout.props;
                if (fieldName) {
                    try {
                        const field = app.field(fieldName);
                        const filterExpression = `=rowno(total)>0 and rowno(total)<=${chunkSize}`;
                        field.selectMatch(filterExpression, false);
                        console.log(`Chunk filter applied to ${fieldName}: ${filterExpression}`);
                    } catch (error) {
                        console.error("Error applying chunk filter:", error.message);
                    }
                } else {
                    console.error("Please provide a field name.");
                }
            });

            $element.empty();
            $element.append($button);
        }
    };
});
