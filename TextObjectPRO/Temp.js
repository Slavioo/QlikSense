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
              options: [
                {
                  value: "OOXML",
                  label: "Excel (OOXML)"
                },
                {
                  value: "CSV_C",
                  label: "CSV (Comma separated)"
                },
                {
                  value: "CSV_T",
                  label: "CSV (Tab separated)"
                }
              ],
              defaultValue: "OOXML"
            }
          }
        }
      }
    },
    paint: function ($element, layout) {
      var app = qlik.currApp(this);
      var $button = $('<button>Export Data</button>');
      $button.on('click', function () {
        var visualizationId = layout.visualizationId;
        var exportFormat = layout.params.exportFormat || "OOXML";

        if (visualizationId) {
          app.visualization.get(visualizationId).then(function (vis) {
            vis.exportData({
              format: exportFormat,
              download: true
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
