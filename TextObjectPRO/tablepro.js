define(["qlik", "jquery", "text!./style.css"], function (qlik, $, cssContent) {
    'use strict';

    $("<style>").html(cssContent).appendTo("head");

    return {
        paint: function ($element, layout) {
            var self = this;
            var html = "";

            // Function to create rows from matrix
            function createRows(rows) {
                var html = "";
                rows.forEach(function (row) {
                    html += '<tr>';
                    row.forEach(function (cell) {
                        html += '<td>' + cell.qText + '</td>';
                    });
                    html += '</tr>';
                });
                return html;
            }

            // Define initial properties here
            var initialProperties = {
                qHyperCubeDef: {
                    qDimensions: [
                        { qDef: { qFieldDefs: ["Location"] } },
                        { qDef: { qFieldDefs: ["Industry"] } }
                    ],
                    qMeasures: [
                        { qDef: { qDef: "Sum([Number of Employees])", qLabel: "Employees" } },
                        { qDef: { qDef: "Sum([Declared Revenue])", qLabel: "Declared Revenue" } },
                        { qDef: { qDef: "Count([Product One])", qLabel: "Number of Product 1" } },
                        { qDef: { qDef: "Sum([Declared Revenue])", qLabel: "test" } }
                    ],
                    qInitialDataFetch: [{ qWidth: 6, qHeight: 50 }]
                }
            };

            var hypercube = layout.qHyperCube;

            // Table 1: Employees and Declared Revenue by Location
            html += "<h3>Employees and Declared Revenue by Location</h3>";
            html += "<table><thead><tr><th>Location</th><th>Employees</th><th>Declared Revenue</th></tr></thead><tbody>";

            html += createRows(hypercube.qDataPages[0].qMatrix.map(function (row) {
                return [row[0], row[2], row[3]]; // Selecting specific columns for this table
            }));

            html += "</tbody></table>";

            // Table 2: Number of Product 1 and test by Industry
            html += "<h3>Number of Product 1 and test by Industry</h3>";
            html += "<table><thead><tr><th>Industry</th><th>Number of Product 1</th><th>test</th></tr></thead><tbody>";

            html += createRows(hypercube.qDataPages[0].qMatrix.map(function (row) {
                return [row[1], row[4], row[5]]; // Selecting specific columns for this table
            }));

            html += "</tbody></table>";

            $element.html(html);
            return qlik.Promise.resolve();
        }
    };
});
