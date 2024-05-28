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
            var button = document.createElement('button');
            button.innerHTML = 'Display Next Chunk';
            button.onclick = displayChunk;
            $element.html(button);

            // Rest of your code...
        }
    };

    return myExtension;
});
