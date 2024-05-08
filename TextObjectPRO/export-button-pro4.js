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
                        pageSize: {
                            type: "integer",
                            ref: "pageSize",
                            label: "Page Size (records per page)",
                            defaultValue: 50
                        },
                        fileSize: {
                            type: "integer",
                            ref: "fileSize",
                            label: "File Size (pages per file)",
                            defaultValue: 1
                        },
                        csvDelimiter: {
                            type: "string",
                            ref: "csvDelimiter",
                            label: "CSV Delimiter",
                            defaultValue: ","
                        },
                        delay: {
                            type: "integer",
                            ref: "delay",
                            label: "Delay (ms)",
                            defaultValue: 1
                        }
                    }
                }
            }
        },
        paint: function($element, layout) {
            var app = qlik.currApp(this);
            var visualizationId = layout.visualizationId;
            var pageSize = layout.pageSize;
            var fileSize = layout.fileSize;
            var csvDelimiter = layout.csvDelimiter;
            var delay = layout.delay;
            var $button = $('<button>Export Data</button>');
            $button.on('click', function() {
                if ($button.text() === 'Export Data') {
                    if (visualizationId) {
                        $button.text('Exporting...');
                        $button.prop('disabled', true);
                        app.visualization.get(visualizationId).then(function(vis) {
                            var numberOfPages = Math.ceil(vis.model.layout.qHyperCube.qSize.qcy / pageSize);
                            var dimensionHeaders = vis.model.layout.qHyperCube.qDimensionInfo.map((dim, id) => ({
                                Id: id,
                                Header: dim.qFallbackTitle
                            }));
                            var measureHeaders = vis.model.layout.qHyperCube.qMeasureInfo.map((measure, id) => ({
                                Id: id + dimensionHeaders.length,
                                Header: measure.qFallbackTitle
                            }));
                            var allHeaders = dimensionHeaders.concat(measureHeaders);
                            var orderedHeaders = vis.model.layout.qHyperCube.qColumnOrder.map(id => allHeaders.find(h => h.Id === id));
                            var promises = [];
                            for (var i = 0; i < numberOfPages; i += fileSize) {
                                (function(startPage) {
                                    var promise = new Promise(function(resolve, reject) {
                                        setTimeout(function() {
                                            var csvContent = orderedHeaders.map(h => h.Header).join(csvDelimiter) + '\n';
                                            var filePromises = [];
                                            for (var j = startPage; j < startPage + fileSize && j < numberOfPages; j++) {
                                                (function(page) {
                                                    var requestPage = [{
                                                        qTop: page * pageSize,
                                                        qLeft: 0,
                                                        qWidth: vis.model.layout.qHyperCube.qSize.qcx,
                                                        qHeight: Math.min(pageSize, vis.model.layout.qHyperCube.qSize.qcy - page * pageSize)
                                                    }];
                                                    var filePromise = vis.model.getHyperCubeData('/qHyperCubeDef', requestPage).then(function(dataPage) {
                                                        csvContent += dataPage[0].qMatrix.map(row => row.map(cell => cell.qText).join(csvDelimiter)).join('\n');
                                                        if (page < startPage + fileSize - 1 && page < numberOfPages - 1) {
                                                            csvContent += '\n';
                                                        }
                                                    });
                                                    filePromises.push(filePromise);
                                                })(j);
                                            }
                                            Promise.all(filePromises).then(function() {
                                                var csvFile = new Blob([csvContent], {
                                                    type: "text/csv"
                                                });
                                                var downloadLink = document.createElement("a");
                                                downloadLink.download = visualizationId + '_pages' + (startPage + 1) + '-' + (startPage + fileSize) + '.csv';
                                                downloadLink.href = window.URL.createObjectURL(csvFile);
                                                downloadLink.style.display = "none";
                                                document.body.appendChild(downloadLink);
                                                downloadLink.click();
                                                resolve();
                                            });
                                        }, startPage * delay);
                                    });
                                    promises.push(promise);
                                })(i);
                            }
                            Promise.all(promises).then(function() {
                                $button.css('background-color', '#D0ECE7');
                                $button.text('Completed');
                                $button.prop('disabled', false);
                                $button.one('click', function() {
                                    $button.css('background-color', '');
                                    $button.text('Export Data');
                                });
                            });
                        });
                    } else {
                        console.error("No visualization id provided.");
                    }
                }
            });
            $element.empty();
            $element.append($button);
        }
    };
});
