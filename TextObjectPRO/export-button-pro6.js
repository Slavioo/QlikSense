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
                            defaultValue: 50,
                            expression: 'optional'
                        },
                        fileSize: {
                            type: "integer",
                            ref: "fileSize",
                            label: "File Size (pages per file)",
                            defaultValue: 1000,
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
                        css: {
                            type: "string",
                            ref: "css",
                            label: "CSS",
                            defaultValue: "",
                            expression: 'optional'
                        },
                        fileNameMask: {
                            type: "string",
                            ref: "fileNameMask",
                            label: "File Name Mask",
                            defaultValue: "",
                            expression: 'optional'
                        },
                    }
                }
            }
        },
        paint: function($element, layout) {
            const app = qlik.currApp(this);
            const $button = $('<button class="export-button">Export Data</button>');
            const css = layout.css;
            $button.on('click', function() {
                if ($button.text() === 'Export Data') {
                    exportData(app, layout, $button);
                }
            });
            $element.empty();
            $element.append('<style>' + css + '</style>');
            $element.append($button);
        }
    };

    function getHeaders(vis) {
        const dimensionHeaders = vis.model.layout.qHyperCube.qDimensionInfo.map((dim, id) => ({
            Id: id,
            Header: dim.qFallbackTitle.replace(/[\r\n]/g, ' ')
        }));
        const measureHeaders = vis.model.layout.qHyperCube.qMeasureInfo.map((measure, id) => ({
            Id: id + dimensionHeaders.length,
            Header: measure.qFallbackTitle.replace(/[\r\n]/g, ' ')
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
        const fileNameMask = layout.fileNameMask;

        if (!visualizationId) {
            console.error("No visualization id provided.");
            return;
        }

        $button.text('Exporting...');
        $button.prop('disabled', true);

        try {
            const vis = await app.visualization.get(visualizationId);
            const numberOfPages = Math.ceil(vis.model.layout.qHyperCube.qSize.qcy / pageSize);
            const headers = getHeaders(vis);

            for (let startPage = 0; startPage < numberOfPages; startPage += fileSize) {
                let csvRows = [headers.map(h => h.Header).join(csvDelimiter)];

                for (let page = startPage; page < startPage + fileSize && page < numberOfPages; page++) {
                    const requestPage = [{
                        qTop: page * pageSize,
                        qLeft: 0,
                        qWidth: vis.model.layout.qHyperCube.qSize.qcx,
                        qHeight: Math.min(pageSize, vis.model.layout.qHyperCube.qSize.qcy - page * pageSize)
                    }];
                    const dataPage = await vis.model.getHyperCubeData('/qHyperCubeDef', requestPage);
                    csvRows.push(...dataPage[0].qMatrix.map(row => row.map(cell => cell.qText).join(csvDelimiter)));
                }

                const csvContent = csvRows.join('\n');
                const csvFile = new Blob([csvContent], { type: "text/csv" });
                const downloadLink = document.createElement("a");
                downloadLink.download = (fileNameMask ? fileNameMask : visualizationId) + '_records' + (startPage * pageSize + 1) + '-' + Math.min((startPage + fileSize) * pageSize, vis.model.layout.qHyperCube.qSize.qcy) + '.csv';
                downloadLink.href = window.URL.createObjectURL(csvFile);
                downloadLink.style.display = "none";
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink); // Clean up

                await new Promise(resolve => setTimeout(resolve, delay));
            }
        } catch (error) {
            console.error("An error occurred during the export process: ", error);
            $button.text('Export Failed');
            // Handle any additional error reporting or user feedback
        } finally {
            $button.prop('disabled', false);
            $button.css('background-color', '#0E6655');
            $button.text('Completed');
            $button.one('click', function() {
                $button.css('background-color', '');
                $button.text('Export Data');
            });
        }
    };
});
