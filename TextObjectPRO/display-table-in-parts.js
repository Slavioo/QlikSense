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
                        },
                        pageSize: {
                            type: "integer",
                            ref: "pageSize",
                            label: "Page Size (records per page)",
                            defaultValue: 5,
                            expression: 'optional'
                        }
                    }
                }
            }
        },
        paint: function($element, layout) {
            const app = qlik.currApp(this);
            const visualizationId = layout.visualizationId;
            const pageSize = layout.pageSize || 5;
            let offset = 0;

            // Create the button if it doesn't exist
            if (!$element.html().includes('pagination-button')) {
                $element.empty();
                const $button = $('<button class="pagination-button">Next 5 Records</button>');
                $element.append($button);

                $button.on('click', function() {
                    app.getObject(visualizationId).then(function(vis) {
                        vis.getLayout().then(function(layout) {
                            const data = layout.qHyperCube.qDataPages[0].qMatrix;
                            const maxOffset = data.length - pageSize;
                            offset = (offset + pageSize > maxOffset) ? 0 : offset + pageSize;
                            const recordsToFilter = data.slice(offset, offset + pageSize).map(function(row) {
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
