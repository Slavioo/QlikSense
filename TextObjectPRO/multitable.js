define(["qlik", "jquery"], function(qlik, $) {
    return {
        definition: {
            type: "items",
            component: "accordion",
            items: {
                settings: {
                    uses: "settings",
                    items: {
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
                        }
                    }
                }
            }
        },
        paint: function($element, layout) {
            const app = qlik.currApp(this);
            const css = layout.css;
            const pageSize = layout.pageSize;

            const visualizations = [
                { id: "kpSSaA", class: "table1" },
                { id: "kTcUKt", class: "table2" }
            ];

            $element.empty().append('<style>' + css + '</style>');

            visualizations.forEach((viz, index) => {
                const tableContainer = $(`<div class="table-container-${index}"></div>`);
                $element.append(tableContainer);
                displayData(app, viz.id, pageSize, tableContainer, viz.class);
            });
        }
    };

    async function getHeaders(vis) {
        const dimensionHeaders = vis.model.layout.qHyperCube.qDimensionInfo.map((dim, id) => ({
            Id: id,
            Header: dim.qFallbackTitle
        }));
        const measureHeaders = vis.model.layout.qHyperCube.qMeasureInfo.map((measure, id) => ({
            Id: id + dimensionHeaders.length,
            Header: measure.qFallbackTitle
        }));
        return dimensionHeaders.concat(measureHeaders).sort((a, b) => a.Id - b.Id);
    }

    async function displayData(app, visualizationId, pageSize, $container, tableClass) {
        try {
            const vis = await app.visualization.get(visualizationId);

            const updateData = async () => {
                const layout = await vis.model.getLayout();
                const requestPage = [{
                    qTop: 0,
                    qLeft: 0,
                    qWidth: layout.qHyperCube.qSize.qcx,
                    qHeight: Math.min(pageSize, layout.qHyperCube.qSize.qcy)
                }];

                const dataPage = await vis.model.getHyperCubeData('/qHyperCubeDef', requestPage);
                const headers = await getHeaders(vis);
                const table = $(`<table class="${tableClass} table-preview"></table>`);
                const headerRow = $('<tr></tr>');

                headers.forEach(header => {
                    const th = $('<th></th>').text(header.Header);
                    headerRow.append(th);
                });

                table.append(headerRow);

                dataPage[0].qMatrix.forEach(row => {
                    const tr = $('<tr></tr>');
                    row.forEach(cell => {
                        const td = $('<td></td>').text(cell.qText);
                        tr.append(td);
                    });
                    table.append(tr);
                });

                $container.empty().append(table);
            };

            vis.model.on("changed", updateData);
            updateData(); // Initial data load
        } catch (error) {
            console.error("Error displaying data:", error);
        }
    }
});
