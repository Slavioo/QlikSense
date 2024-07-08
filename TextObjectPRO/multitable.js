define(["qlik", "jquery"], function(qlik, $) {
    return {
        definition: {
            type: "items",
            component: "accordion",
            items: {
                settings: {
                    uses: "settings",
                    items: {
                        visualizations: {
                            type: "array",
                            ref: "visualizations",
                            label: "Visualizations",
                            itemTitleRef: "id",
                            allowAdd: true,
                            allowRemove: true,
                            addTranslation: "Add Visualization",
                            items: {
                                id: {
                                    type: "string",
                                    ref: "id",
                                    label: "Visualization ID",
                                    expression: "optional"
                                },
                                columnId: {
                                    type: "integer",
                                    ref: "columnId",
                                    label: "Column ID",
                                    expression: "optional",
                                    defaultValue: 1
                                }
                            }
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
                        javascript: {
                            type: "string",
                            ref: "javascript",
                            label: "JavaScript",
                            defaultValue: "",
                            expression: 'optional'
                        }
                    }
                }
            }
        },
        paint: async function($element, layout) {
            const app = qlik.currApp(this);
            const css = '<style>' + layout.css + '</style>';
            const javascript = layout.javascript || "";

            const visualizations = layout.visualizations || [];

            $element.empty().append(css);

            const groupedVisualizations = groupByColumnId(visualizations);

            const mainContainer = $('<div class="container"></div>');
            $element.append(mainContainer);

            for (const columnId in groupedVisualizations) {
                const columnContainer = $('<div class="column"></div>');
                mainContainer.append(columnContainer);

                for (const viz of groupedVisualizations[columnId]) {
                    const tableContainer = $('<div class="table-container"></div>')
                        .attr('data-grid-column-id', columnId);
                    columnContainer.append(tableContainer);
                    await displayData(app, viz.id, layout.pageSize, tableContainer);
                }
            }

            if (javascript) {
                try {
                    const script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.text = javascript;
                    document.body.appendChild(script);
                } catch (error) {
                    console.error("Error executing custom JavaScript:", error);
                }
            }
        }
    };

    async function displayData(app, visualizationId, pageSize, $container) {
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
                const table = $('<table class="table-preview"></table>');
                const headerRow = $('<tr></tr>');

                headers.forEach(header => {
                    const th = $('<th></th>').text(header.Header);
                    headerRow.append(th);
                });

                table.append(headerRow);

                dataPage[0].qMatrix.forEach(row => {
                    const tr = $('<tr></tr>');
                    row.forEach((cell, index) => {
                        const td = $('<td></td>').text(cell.qText);
                        if (index === 1 || index === 2) {
                            if (row[1].qText !== row[2].qText) {
                                td.addClass('highlight');
                            }
                        }
                        tr.append(td);
                    });
                    table.append(tr);
                });

                $container.empty().append(table);
            };

            vis.model.on("changed", updateData);
            updateData();
        } catch (error) {
            console.error("Error displaying data:", error);
        }
    }

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

    function groupByColumnId(visualizations) {
        return visualizations.reduce((acc, viz) => {
            const { columnId } = viz;
            if (!acc[columnId]) {
                acc[columnId] = [];
            }
            acc[columnId].push(viz);
            return acc;
        }, {});
    }
});
