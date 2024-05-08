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
                            defaultValue: 1000
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
                            defaultValue: 100
                        }
                    }
                }
            }
        },
        paint: function($element, layout) {
            const app = qlik.currApp(this);
            const $button = $('<button>Export Data</button>');
            $button.on('click', function() {
                if ($button.text() === 'Export Data') {
                    exportData(app, layout, $button);
                }
            });
            $element.empty();
            $element.append($button);
        }
    };

    function getHeaders(vis) {
        const dimensionHeaders = vis.model.layout.qHyperCube.qDimensionInfo.map((dim, id) => ({
            Id: id,
            Header: dim.qFallbackTitle
        }));
        const measureHeaders = vis.model.layout.qHyperCube.qMeasureInfo.map((measure, id) => ({
            Id: id + dimensionHeaders.length,
            Header: measure.qFallbackTitle
        }));
        const allHeaders = dimensionHeaders.concat(measureHeaders);
        const orderedHeaders = vis.model.layout.qHyperCube.qColumnOrder.map(id => allHeaders.find(h => h.Id === id));
        const populatedHeaders = orderedHeaders.filter(h => h.Header && h.Header.trim() !== '');
        return populatedHeaders;
    };

    async function exportData(app, layout, $button) {
        const visualizationId = layout.visualizationId;
        const pageSize = layout.pageSize;
        const fileSize = layout.fileSize;
        const csvDelimiter = layout.csvDelimiter;
        const delay = layout.delay;

        if (!visualizationId) {
            console.error("No visualization id provided.");
            return;
        }

        $button.text('Exporting...');
        $button.prop('disabled', true);

        const vis = await app.visualization.get(visualizationId);
        const numberOfPages = Math.ceil(vis.model.layout.qHyperCube.qSize.qcy / pageSize);
        const headers = getHeaders(vis);

        for (let startPage = 0; startPage < numberOfPages; startPage += fileSize) {
            let csvContent = headers.map(h => h.Header).join(csvDelimiter) + '\n';

            for (let page = startPage; page < startPage + fileSize && page < numberOfPages; page++) {
                const requestPage = [{
                    qTop: page * pageSize,
                    qLeft: 0,
                    qWidth: vis.model.layout.qHyperCube.qSize.qcx,
                    qHeight: Math.min(pageSize, vis.model.layout.qHyperCube.qSize.qcy - page * pageSize)
                }];
                const dataPage = await vis.model.getHyperCubeData('/qHyperCubeDef', requestPage);
                csvContent += dataPage[0].qMatrix.map(row => row.map(cell => cell.qText).join(csvDelimiter)).join('\n');
                if (page < startPage + fileSize - 1 && page < numberOfPages - 1) {
                    csvContent += '\n';
                }
            }

            const csvFile = new Blob([csvContent], { type: "text/csv" });
            const downloadLink = document.createElement("a");
            downloadLink.download = visualizationId + '_pages' + (startPage + 1) + '-' + (startPage + fileSize) + '.csv';
            downloadLink.href = window.URL.createObjectURL(csvFile);
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
            downloadLink.click();

            await new Promise(resolve => setTimeout(resolve, delay));
        }

        $button.css('background-color', '#D0ECE7');
        $button.text('Completed');
        $button.prop('disabled', false);
        $button.one('click', function() {
            $button.css('background-color', '');
            $button.text('Export Data');
        });
    };
});
