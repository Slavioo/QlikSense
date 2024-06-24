define(["qlik", "jquery", "text!./style.css"], function (qlik, $, cssContent) {
    'use strict';

    $("<style>").html(cssContent).appendTo("head");

    function createRows(rows, dimensionInfo) {
        var html = "";
        rows.forEach(function (row) {
            html += '<tr>';
            row.forEach(function (cell) {
                html += "<td>" + cell.qText + "</td>";
            });
            html += '</tr>';
        });
        return html;
    }

    const numberOfCubes = 8; // Adjust this to the desired number of cubes
    const initialProperties = {};
    const definitionItems = {};

    for (let i = 1; i <= numberOfCubes; i++) {
        initialProperties[`cube${i}`] = {
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [{
                    qWidth: 10,
                    qHeight: 50
                }]
            }
        };

        definitionItems[`cube${i}props`] = {
            label: `Cube ${i}`,
            type: "items",
            items: {
                dimension: {
                    label: "Dimension",
                    type: "string",
                    expression: "always",
                    expressionType: "dimension",
                    ref: `cube${i}.qHyperCubeDef.qDimensions.0.qDef.qFieldDefs.0`
                },
                measure: {
                    label: "Measure",
                    type: "string",
                    expression: "always",
                    expressionType: "measure",
                    ref: `cube${i}.qHyperCubeDef.qMeasures.0.qDef.qDef`
                }
            }
        };
    }

    return {
        initialProperties: initialProperties,
        definition: {
            type: "items",
            component: "accordion",
            items: definitionItems
        },
        snapshot: {
            canTakeSnapshot: true
        },
        paint: function ($element, layout) {
            let html = "";
            for (let i = 1; i <= numberOfCubes; i++) {
                const hypercube = layout[`cube${i}`].qHyperCube;
                let cubeHtml = "<table><thead><tr>";

                // Render titles for the current cube
                hypercube.qDimensionInfo.forEach(function (cell) {
                    cubeHtml += '<th>' + cell.qFallbackTitle + '</th>';
                });
                hypercube.qMeasureInfo.forEach(function (cell) {
                    cubeHtml += '<th>' + cell.qFallbackTitle + '</th>';
                });
                cubeHtml += "</tr></thead><tbody>";

                // Render data for the current cube
                cubeHtml += createRows(hypercube.qDataPages[0].qMatrix, hypercube.qDimensionInfo);
                cubeHtml += "</tbody></table>";

                html += cubeHtml;
            }

            $element.html(html);

            return qlik.Promise.resolve();
        }
    };
});
