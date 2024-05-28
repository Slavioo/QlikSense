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
            var tableData = qlik.table(tableId).qHyperCube.qDataPages[0].qMatrix;

            // Function to display records in chunks
            var currentIndex = 0;
            var displayChunk = function() {
                var recordsToDisplay = tableData.slice(currentIndex, currentIndex + chunkSize);
                $element.html('<pre>' + JSON.stringify(recordsToDisplay, null, 2) + '</pre>');
                currentIndex += chunkSize;

                // Check if there are more records to display
                if (currentIndex < tableData.length) {
                    setTimeout(displayChunk, waitTime * 1000); // Schedule the next chunk
                }
            };

            // Start displaying the first chunk
            displayChunk();
        }
    };

    return myExtension;
});
