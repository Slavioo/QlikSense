define(["qlik", "jquery"], function(qlik, $) {
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
                            defaultValue: "",
                            expression: 'optional'
                        }
                    }
                }
            }
        },
        paint: function($element, layout) {
            const app = qlik.currApp(this);
            const visualizationId = layout.visualizationId;

            // Create the button if it doesn't exist
            if (!$element.html().includes('filter-button')) {
                $element.empty();
                const $button = $('<button class="filter-button">Filter First 5 Records</button>');
                $element.append($button);

                $button.on('click', function() {
                    app.getObject(visualizationId).then(function(vis) {
                        vis.getLayout().then(function(layout) {
                            const data = layout.qHyperCube.qDataPages[0].qMatrix;
                            const recordsToFilter = data.slice(0, 5).map(function(row) {
                                return row[0].qText; // Assuming the first column contains the values to filter
                            });

                            const field = app.field('YourFieldName');
                            field.clear();
                            field.selectValues(recordsToFilter, false, false);
                        });
                    });
                });
            }
        }
    };
});
