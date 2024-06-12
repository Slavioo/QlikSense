// Assuming qlik object is available
define(["qlik"], function(qlik) {
    return {
        // Define the properties panel
        definition: {
            type: "items",
            component: "accordion",
            items: {
                settings: {
                    uses: "settings",
                    items: {
                        myTextBox: {
                            type: "string",
                            label: "Original Visualization ID",
                            ref: "originalVisId",
                            defaultValue: ""
                        }
                    }
                }
            }
        },
        // Initial properties of the extension
        initialProperties: {
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [{
                    qWidth: 10,
                    qHeight: 5
                }]
            }
        },
        // The paint function that renders the extension
        paint: function($element, layout) {
            var app = qlik.currApp(this);
            var originalVisId = layout.originalVisId;
            
            // Retrieve the original visualization's data
            app.getObjectProperties(originalVisId).then(function(model) {
                var hyperCube = model.properties.qHyperCubeDef;
                
                // Manipulate the data to get the first 5 records
                var data = hyperCube.qDataPages[0].qMatrix.slice(0, 5);
                
                // Render the new table with the data
                var html = '<table>';
                data.forEach(function(row) {
                    html += '<tr>';
                    row.forEach(function(cell) {
                        html += '<td>' + cell.qText + '</td>';
                    });
                    html += '</tr>';
                });
                html += '</table>';
                
                $element.html(html);
            });
        }
    };
});
