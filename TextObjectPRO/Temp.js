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
        const headers = getHeaders(vis);

        let currentPage = 0;
        let totalRecords = 0; // Keep track of the total records exported
        let csvRows = [headers.map(h => h.Header).join(csvDelimiter)];

        while (totalRecords < 500) {
            const recordsToFetch = Math.min(pageSize, 500 - totalRecords);
            const requestPage = [{
                qTop: currentPage * pageSize,
                qLeft: 0,
                qWidth: vis.model.layout.qHyperCube.qSize.qcx,
                qHeight: recordsToFetch
            }];
            const dataPage = await vis.model.getHyperCubeData('/qHyperCubeDef', requestPage);

            if (dataPage[0].qMatrix.length === 0) {
                // No more data available
                break;
            }

            csvRows.push(...dataPage[0].qMatrix.map(row => row.map(cell => cell.qText).join(csvDelimiter)));
            totalRecords += dataPage[0].qMatrix.length;
            currentPage++;

            await new Promise(resolve => setTimeout(resolve, delay));
        }

        const csvContent = csvRows.join('\n');
        const csvFile = new Blob([csvContent], { type: "text/csv" });
        const downloadLink = document.createElement("a");
        downloadLink.download = (fileNameMask ? fileNameMask : visualizationId) + '_records.csv';
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink); // Clean up
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
}
