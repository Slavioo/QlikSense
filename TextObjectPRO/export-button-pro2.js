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
                        }
                    }
                }
            }
        },
        paint: function($element, layout) {
            var app = qlik.currApp(this);
            var visualizationId = layout.visualizationId;
            var $button = $('<button>Export Data</button>');
            $button.on('click', function() {
                if (visualizationId) {
                    app.visualization.get(visualizationId).then(function(vis) {
                        var pageHeight = 5000; // Number of records to fetch at a time
                        var numberOfPages = Math.ceil(vis.model.layout.qHyperCube.qSize.qcy / pageHeight);
                        var dimensionHeaders = vis.model.layout.qHyperCube.qDimensionInfo.map((dim, id) => ({ Id: id, Header: dim.qFallbackTitle }));
                        var measureHeaders = vis.model.layout.qHyperCube.qMeasureInfo.map((measure, id) => ({ Id: id + dimensionHeaders.length, Header: measure.qFallbackTitle }));
                        var allHeaders = dimensionHeaders.concat(measureHeaders);
                        var orderedHeaders = vis.model.layout.qHyperCube.qColumnOrder.map(id => allHeaders.find(h => h.Id === id));
                        for (var i = 0; i < numberOfPages; i++) {
                            (function(page) {
                                setTimeout(function() {
                                    var requestPage = [{
                                        qTop: page * pageHeight,
                                        qLeft: 0,
                                        qWidth: vis.model.layout.qHyperCube.qSize.qcx,
                                        qHeight: Math.min(pageHeight, vis.model.layout.qHyperCube.qSize.qcy - page * pageHeight)
                                    }];
                                    vis.model.getHyperCubeData('/qHyperCubeDef', requestPage).then(function(dataPage) {
                                        var csvContent = orderedHeaders.map(h => h.Header).join(',') + '\n';
                                        csvContent += dataPage[0].qMatrix.map(row => row.map(cell => cell.qText).join(',')).join('\n');
                                        var csvFile = new Blob([csvContent], {type: "text/csv"});
                                        var downloadLink = document.createElement("a");
                                        downloadLink.download = visualizationId + '_page' + (page + 1) + '.csv';
                                        downloadLink.href = window.URL.createObjectURL(csvFile);
                                        downloadLink.style.display = "none";
                                        document.body.appendChild(downloadLink);
                                        downloadLink.click();
                                    });
                                }, page * 100); // 100ms delay between each file
                            })(i);
                        }
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
