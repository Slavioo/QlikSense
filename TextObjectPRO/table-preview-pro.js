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
                            expression: "optional"
                        },
                        css: {
                            type: "string",
                            ref: "css",
                            label: "CSS",
                            defaultValue: "",
                            expression: "optional"
                        },
                        pageSize: {
                            type: "number",
                            ref: "pageSize",
                            label: "Page Size",
                            defaultValue: 10,
                            min: 1,
                            max: 100
                        }
                    }
                }
            }
        },
        paint: function($element, layout) {
            const app = qlik.currApp(this);
            const visualizationId = layout.visualizationId;
            const css = layout.css;
            const pageSize = layout.pageSize;

            if (!visualizationId) {
                console.error("No visualization id provided.");
                return;
            }

            app.visualization.get(visualizationId).then(function(vis) {
                const requestPage = [{
                    qTop: 0,
                    qLeft: 0,
                    qWidth: vis.model.layout.qHyperCube.qSize.qcx,
                    qHeight: Math.min(pageSize, vis.model.layout.qHyperCube.qSize.qcy)
                }];

                vis.model.getHyperCubeData('/qHyperCubeDef', requestPage).then(function(dataPage) {
                    const headers = getHeaders(vis);
                    const table = $('<table class="table"></table>');
                    const headerRow = $('<tr></tr>');
                    headers.forEach(function(header) {
                        const th = $('<th></th>');
                        th.text(header.Header);
                        headerRow.append(th);
                    });
                    table.append(headerRow);

                    dataPage[0].qMatrix.forEach(function(row) {
                        const tr = $('<tr></tr>');
                        row.forEach(function(cell) {
                            const td = $('<td></td>');
                            td.text(cell.qText);
                            tr.append(td);
                        });
                        table.append(tr);
                    });

                    $element.empty();
                    $element.append('<style>' + css + '</style>');
                    $element.append(table);
                });
            });
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
});
