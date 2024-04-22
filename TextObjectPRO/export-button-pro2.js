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
                            label: "Page Size",
                            defaultValue: 500,
							expression: 'optional'
                        },
                        csvDelimiter: {
                            type: "string",
                            ref: "csvDelimiter",
                            label: "CSV Delimiter",
                            defaultValue: ",",
							expression: 'optional'
                        },
                        delay: {
                            type: "integer",
                            ref: "delay",
                            label: "Delay (ms)",
                            defaultValue: 100,
							expression: 'optional'
                        },
                        fileNameMask: {
                            type: "string",
                            ref: "fileNameMask",
                            label: "File Name Mask",
                            defaultValue: "export",
							expression: 'optional'
                        },
                        css: {
                            type: "string",
                            ref: "css",
                            label: "CSS",
                            defaultValue: "display: inline-block;outline: 0;text-align: center;cursor: pointer;padding: 0px 16px;border-radius: 2px;min-width: 80px;height: 32px;background-color: rgb(0, 120, 212);color: rgb(255, 255, 255);font-size: 14px;font-weight: 400;box-sizing: border-box;border: 1px solid rgb(0, 120, 212);",
							expression: 'optional'
                        }
                    }
                }
            }
        },
        paint: function($element, layout) {
            var app = qlik.currApp(this);
            var visualizationId = layout.visualizationId;
            var pageSize = layout.pageSize;
            var csvDelimiter = layout.csvDelimiter;
            var delay = layout.delay;
            var fileNameMask = layout.fileNameMask;
            var css = layout.css;
            var $button = $('<button style="' + css + '">Export Data</button>');
            $button.on('click', function() {
                if ($button.text() === 'Export Data') {
                    if (visualizationId) {
                        $button.text('Exporting...');
                        $button.prop('disabled', true);
                        app.visualization.get(visualizationId).then(function(vis) {
                            var numberOfPages = Math.ceil(vis.model.layout.qHyperCube.qSize.qcy / pageSize);
                            var dimensionHeaders = vis.model.layout.qHyperCube.qDimensionInfo.map((dim, id) => ({ Id: id, Header: dim.qFallbackTitle })).filter(h => h.Header);
                            var measureHeaders = vis.model.layout.qHyperCube.qMeasureInfo.map((measure, id) => ({ Id: id + dimensionHeaders.length, Header: measure.qFallbackTitle })).filter(h => h.Header);
                            var allHeaders = dimensionHeaders.concat(measureHeaders);
                            var orderedHeaders = vis.model.layout.qHyperCube.qColumnOrder.map(id => allHeaders.find(h => h.Id === id)).filter(h => h);
                            var promises = [];
                            for (var i = 0; i < numberOfPages; i++) {
                                (function(page) {
                                    var promise = new Promise(function(resolve, reject) {
                                        setTimeout(function() {
                                            var requestPage = [{
                                                qTop: page * pageSize,
                                                qLeft: 0,
                                                qWidth: vis.model.layout.qHyperCube.qSize.qcx,
                                                qHeight: Math.min(pageSize, vis.model.layout.qHyperCube.qSize.qcy - page * pageSize)
                                            }];
                                            vis.model.getHyperCubeData('/qHyperCubeDef', requestPage).then(function(dataPage) {
                                                var csvContent = orderedHeaders.map(h => h.Header).join(csvDelimiter) + '\n';
                                                csvContent += dataPage[0].qMatrix.map(row => row.map(cell => cell.qText).join(csvDelimiter)).join('\n');
                                                var csvFile = new Blob([csvContent], {type: "text/csv"});
                                                var downloadLink = document.createElement("a");
                                                downloadLink.download = fileNameMask + '_page' + (page + 1) + '.csv';
                                                downloadLink.href = window.URL.createObjectURL(csvFile);
                                                downloadLink.style.display = "none";
                                                document.body.appendChild(downloadLink);
                                                downloadLink.click();
                                                resolve();
                                            });
                                        }, page * delay); // delay between each file
                                    });
                                    promises.push(promise);
                                })(i);
                            }
                            Promise.all(promises).then(function() {
                                $button.text('Completed');
                                $button.prop('disabled', false);
								$element.attr('title', 'Click to acknowledge. You  will be able to use the button again.');
                                $button.one('click', function() {
                                    $button.text('Export Data');
									$element.attr('title', '');
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
