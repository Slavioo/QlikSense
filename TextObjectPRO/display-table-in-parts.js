// Define your extension
define(['qlik'], function(qlik) {
    'use strict';

    // Create your extension object
    var myExtension = {
        // Properties
        definition: {
            type: 'items',
            component: 'accordion',
            items: {
                settings: {
                    uses: 'settings',
                    items: {
                        tableId: {
                            type: 'string',
                            label: 'Table ID',
                            ref: 'props.tableId'
                        },
                        chunkSize: {
                            type: 'integer',
                            label: 'Chunk Size',
                            ref: 'props.chunkSize',
                            defaultValue: 50000
                        },
                        waitTime: {
                            type: 'integer',
                            label: 'Wait Time (seconds)',
                            ref: 'props.waitTime',
                            defaultValue: 5
                        }
                    }
                }
            }
        },

        // Initial rendering
        paint: function($element, layout) {
            // Get the table ID, chunk size, and wait time from the extension settings
            var tableId = layout.props.tableId;
            var chunkSize = layout.props.chunkSize || 50000; // Default to 50000 if not set
            var waitTime = layout.props.waitTime || 5; // Default to 5 seconds if not set

            // Fetch the data from the table
            var table = qlik.table(tableId);
            table.getHyperCubeData('/qHyperCubeDef', [{
                qTop: 0,
                qLeft: 0,
                qWidth: table.qHyperCube.qSize.qcx,
                qHeight: Math.min(chunkSize, 10000) // Adjust based on Qlik Sense limitations
            }]).then(function(pages) {
                var tableData = pages[0].qMatrix;

                // Function to display records in chunks
                var currentIndex = 0;
                var displayChunk = function() {
                    var recordsToDisplay = tableData.slice(currentIndex, currentIndex + chunkSize);
                    $element.empty().append('<pre>' + JSON.stringify(recordsToDisplay, null, 2) + '</pre>');
                    currentIndex += chunkSize;

                    // Check if there are more records to display
                    if (currentIndex < tableData.length) {
                        setTimeout(displayChunk, waitTime * 1000); // Schedule the next chunk
                    }
                };

                // Button to manually trigger the next chunk display
                var button = document.createElement('button');
                button.innerHTML = 'Display Next Chunk';
                button.onclick = displayChunk;
                $element.append(button);

                // Start displaying the first chunk
                displayChunk();
            });
        }
    };

    return myExtension;
});
