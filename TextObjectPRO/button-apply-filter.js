define(["qlik", "jquery"], function (qlik, $) {
  return {
    paint: function ($element) {
      // Create a button element and append it to the Qlik Sense element
      const buttonHtml = '<button id="filterGrowthBtn">Filter Growth</button>';
      $element.html(buttonHtml);

      // Add event listener to the button
      $("#filterGrowthBtn").on("click", function () {
        // Get the app instance
        const app = qlik.currApp();

        // Apply filter to the "Title" field for the value "Growth"
        app.field("Title").selectValues(["Growth"], false, false)
          .then(function () {
            console.log("Filter applied for Growth");
          })
          .catch(function (error) {
            console.error("Error applying filter:", error);
          });
      });
    }
  };
});
