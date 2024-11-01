define(["qlik", "jquery"], function(qlik, $) {
    return {
        definition: {
            type: "items",
            component: "accordion",
            items: {
                settings: {
                    uses: "settings",
                    items: {
                        instanceId: {
                            type: "string",
                            ref: "instanceId",
                            label: "Instance ID",
                            defaultValue: "instance1",
                            expression: "optional"
                        },
                        visualizations: { /* existing settings here */ },
                        pageSize: { /* existing settings here */ },
                        css: { /* existing settings here */ },
                        valuesToCompare: { /* existing settings here */ }
                    }
                }
            }
        },
        paint: async function($element, layout) {
            const app = qlik.currApp(this);
            const instanceId = layout.instanceId || "instance1";
            const css = '<style>' + layout.css + '</style>';
            
            // Use the instanceId in class names
            const mainContainer = $(`<div class="container ${instanceId}-container"></div>`);
            $element.empty().append(css).append(mainContainer);
            
            const visualizations = layout.visualizations || [];
            const groupedVisualizations = groupByColumnId(visualizations);
            
            for (const columnId in groupedVisualizations) {
                const columnContainer = $(`<div class="column ${instanceId}-column"></div>`);
                mainContainer.append(columnContainer);

                for (const viz of groupedVisualizations[columnId]) {
                    const tableContainer = $(`<div class="table-container ${instanceId}-table"></div>`)
                        .attr('data-grid-column-id', columnId);
                    columnContainer.append(tableContainer);
                    await displayData(app, viz.id, layout.pageSize, tableContainer, layout.prevColumnName, layout.currColumnName);
                }
            }

            // Event handlers for copy functionality
            $element.on('click', `.${instanceId}-table .copyable`, function() { /* copy functionality */ });
            $element.on('click', `.${instanceId}-table th`, function() { /* copy table functionality */ });
        }
    };
    
    async function displayData(app, visualizationId, pageSize, $container, prevColumnName, currColumnName) {
        // Your displayData implementation here
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
