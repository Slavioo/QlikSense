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
                            defaultValue: ""
                        },
                        fileFormat: {
                            type: "string",
                            component: "dropdown",
                            label: "File Format",
                            ref: "fileFormat",
                            options: [{
                                value: "csv",
                                label: "CSV"
                            }, {
                                value: "xlsx",
                                label: "Excel"
                            }, {
                                value: "txt",
                                label: "Text"
                            }],
                            defaultValue: "csv"
                        },
                        // Add a new input field for file name
                        fileName: {
                            type: "string",
                            ref: "fileName",
                            label: "File Name",
                            defaultValue: "data"
                        }
                    }
                }
            }
        },
        paint: function($element, layout) {
            var app = qlik.currApp(this);
            var $button = $('<button>Export Data</button>');
            $button.on('click', function() {
                var visualizationId = layout.visualizationId;
                var fileFormat = layout.fileFormat || "csv";
                var fileName = layout.fileName || "data"; // Use a default name if none is provided
                if (visualizationId) {
                    app.visualization.get(visualizationId).then(function(vis) {
                        vis.exportData({format: fileFormat}).then(function(data) {
                            var blobType = 'text/' + (fileFormat === 'xlsx' ? 'vnd.openxmlformats-officedocument.spreadsheetml.sheet' : fileFormat);
                            var fileExtension = fileFormat;
                            var blobData = fileFormat === 'csv' || fileFormat === 'txt' ? [data] : data;
                            var file = new Blob(blobData, {type: blobType});
                            var downloadLink = document.createElement("a");
                            downloadLink.download = fileName + '.' + fileExtension;
                            downloadLink.href = window.URL.createObjectURL(file);
                            downloadLink.style.display = "none";
                            document.body.appendChild(downloadLink);
                            downloadLink.click();
                        });
                    });
                } else {
                    console.error("No visualization id provided.");
                }
            });
            $element.empty();
            $element.append($button);
        }
    };
});
