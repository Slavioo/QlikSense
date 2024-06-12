define(["qlik", "jquery"], function (qlik, $) {
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
            exportFormat: {
              type: "string",
              component: "dropdown",
              label: "Export Format",
              ref: "params.exportFormat",
              options: [{
                value: "OOXML",
                label: "Excel (OOXML)"
              }, {
                value: "CSV_C",
                label: "CSV (Comma separated)"
              }, {
                value: "CSV_T",
                label: "CSV (Tab separated)"
              }],
              defaultValue: "OOXML"
            },
            chunkSize: {
              type: "integer",
              ref: "params.chunkSize",
              label: "Chunk Size",
              defaultValue: 500
            },
            css: {
              type: "string",
              ref: "css",
              label: "CSS",
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
        const visualizationId = layout.visualizationId;
        const exportFormat = layout.params.exportFormat || "OOXML";
        const chunkSize = layout.params.chunkSize || 500; // Use the chunk size from the settings
        if (visualizationId) {
          app.visualization.get(visualizationId).then(function(vis) {
            // Initialize the range for the first chunk
            let qMin = 0;
            let qMax = chunkSize - 1;
            let chunkIndex = 0; // To keep track of the chunk number

            // Function to export a single chunk
            function exportChunk() {
              vis.exportData({
                format: exportFormat,
                qRange: {
                  qTop: qMin,
                  qLeft: 0,
                  qWidth: 1, // Adjust based on the number of dimensions and measures
                  qHeight: qMax - qMin + 1
                }
              }).then(function(reply) {
                // Create a blob from the reply data
                var blob = new Blob([reply], {type: 'text/csv;charset=utf-8;'});
                // Generate a download link and click it to download the file
                var downloadLink = document.createElement("a");
                var blobURL = URL.createObjectURL(blob);
                downloadLink.href = blobURL;
                downloadLink.download = "data_chunk_" + chunkIndex + ".csv"; // Name the file with the chunk index
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

                // Update the range for the next chunk
                qMin += chunkSize;
                qMax += chunkSize;
                chunkIndex++; // Increment the chunk number

                // Check if there are more chunks to export
                if (qMin < vis.qHyperCube.qSize.qcy) {
                  exportChunk(); // Export the next chunk
                } else {
                  // All chunks have been exported
                  console.log("All chunks have been exported.");
                }
              }).catch(function(error) {
                console.error('Error exporting chunk:', error);
              });
            }

            // Start exporting the first chunk
            exportChunk();
          });
        } else {
          console.error("No visualization id provided.");
        }
      });
      $element.empty();
      $element.append('<style>' + css + '</style>');
      $element.append($button);
    }
  };
});
