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
            const css = layout.css;
            const visualizationId = layout.visualizationId;
            const pageSize = layout.pageSize;

            displayData(app, visualizationId, pageSize, $element, css);
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

    async function displayData(app, visualizationId, pageSize, $element, css) {
        if (!visualizationId) {
            console.error("No visualization id provided.");
            return;
        }

        const vis = await app.visualization.get(visualizationId);
        const requestPage = [{
            qTop: 0,
            qLeft: 0,
            qWidth: vis.model.layout.qHyperCube.qSize.qcx,
            qHeight: Math.min(pageSize, vis.model.layout.qHyperCube.qSize.qcy)
        }];

        const dataPage = await vis.model.getHyperCubeData('/qHyperCubeDef', requestPage);
        const headers = getHeaders(vis);
        const table = $('<table class="table-preview"></table>');
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
    }
});
