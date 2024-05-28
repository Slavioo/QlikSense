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
              defaultValue: ""
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
            fileNameMask: {
              type: "string",
              ref: "fileNameMask",
              label: "File Name Mask",
              defaultValue: ""
            },
            css: {
              type: "string",
              ref: "css",
              label: "Custom CSS",
              defaultValue: ""
            }
          }
        }
      }
    },
    paint: function ($element, layout) {
      var app = qlik.currApp(this);
      var visualizationId = layout.visualizationId;
      var exportFormat = layout.params.exportFormat || "OOXML";
      var fileNameMask = layout.fileNameMask || "ExportedData";

      // Apply custom CSS if provided
      if (layout.css) {
        $element.append('<style>' + layout.css + '</style>');
      }

      // Create the export button
      var $exportButton = $('<button class="export-button">Export Data</button>');
      $exportButton.on('click', function () {
        app.visualization.get(visualizationId).then(function (vis) {
          vis.exportData({
            format: exportFormat,
            filename: fileNameMask,
            download: true
          });
        });
      });

      // Append the button to the Qlik Sense sheet
      $element.empty().append($exportButton);
    }
  };
});
