define(["qlik"], function (qlik) {
    return {
        definition: {
            type: "items",
            component: "accordion",
            items: {
                settings: {
                    uses: "settings",
                    items: {
                        field: {
                            type: "string",
                            label: "Field Name",
                            ref: "props.fieldName"
                        }
                    }
                }
            }
        },
        paint: function ($element, layout) {
            // Retrieve the field name from the extension settings
            var fieldName = layout.props.fieldName;

            // Get the current app
            var app = qlik.currApp();

            // Get all distinct values from the field
            app.field(fieldName).getData().then(function (fieldData) {
                var fieldValues = fieldData.rows.map(function (row) {
                    return row.qText;
                });

                // Sort the values alphabetically
                fieldValues.sort();

                // Initialize index for cycling through values
                var currentIndex = 0;

                // Function to update the filter value
                function updateFilterValue() {
                    app.field(fieldName).selectMatch(fieldValues[currentIndex]);
                    currentIndex = (currentIndex + 1) % fieldValues.length;
                }

                // Set an interval to update the filter value every 10 seconds
                setInterval(updateFilterValue, 10000);
            });
        }
    };
});
