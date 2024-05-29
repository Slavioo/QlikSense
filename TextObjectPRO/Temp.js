// myfilterpane.js

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
                            label: "Select Field",
                            ref: "props.field",
                            expression: "optional",
                        },
                    },
                },
            },
        },
        paint: function ($element, layout) {
            // Get the selected field value
            var selectedField = layout.props.field;

            // Get the current app
            var app = qlik.currApp();

            // Fetch data for the selected field
            app.field(selectedField).getData().then(function (data) {
                var values = data.rows.map(function (row) {
                    return row.qText;
                });

                // Create a filterpane UI element
                $element.html('<select id="myFilterpane"></select>');
                var $filterpane = $("#myFilterpane");

                // Populate the filterpane with values
                values.forEach(function (value) {
                    $filterpane.append('<option value="' + value + '">' + value + '</option>');
                });

                // Handle selection changes
                $filterpane.on("change", function () {
                    var selectedValues = [$filterpane.val()];
                    app.field(selectedField).selectValues(selectedValues, true);
                });
            });
        },
    };
});
