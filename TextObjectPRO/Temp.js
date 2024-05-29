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
                        filterExpression: {
                            type: "string",
                            ref: "props.filterExpression",
                            label: "Filter Expression",
                            defaultValue: ""
                        }
                    }
                }
            }
        },
        paint: function($element, layout) {
            const app = qlik.currApp(this);
            const $button = $('<button>Apply Filter</button>');

            $button.on('click', function() {
                const { fieldName, filterExpression } = layout.props;
                if (fieldName && filterExpression) {
                    try {
                        const field = app.field(fieldName);
                        field.selectMatch(filterExpression);
                        console.log(`Filter applied to ${fieldName}: ${filterExpression}`);
                    } catch (error) {
                        console.error("Error applying filter:", error.message);
                    }
                } else {
                    console.error("Please provide both field name and filter expression.");
                }
            });

            $element.empty();
            $element.append($button);
        }
    };
});
