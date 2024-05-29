
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

            // Fetch data for the selected field
            qlik.currApp().field(selectedField).getData().then(function (data) {
                var values = data.rows.map(function (row) {
                    return row.qText;
                });

                // Create a listbox UI element
                $element.html('<select id="myListbox"></select>');
                var $listbox = $("#myListbox");

                // Populate the listbox with values
                values.forEach(function (value) {
                    $listbox.append('<option value="' + value + '">' + value + '</option>');
                });

                // Handle selection changes
                $listbox.on("change", function () {
                    var selectedValues = [$listbox.val()];
                    qlik.currApp().field(selectedField).selectValues(selectedValues, true);
                });
            });
        },
    };
});
