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
                            label: "Source Object ID",
                            expression: "optional"
                        }
                    }
                }
            }
        },

        support: {
            exportData: false
        },

        paint: async function($element, layout) {
            const app = qlik.currApp(this);
            const visualizationId = layout.visualizationId;

            if (!visualizationId) {
                $element.html("Please provide a source object ID.");
                return;
            }

            let lockedTitle = null;
            let hoveredTitle = null;
            let renderBlocked = false;
            let rerenderScheduled = false;

            const scheduleRender = () => {
                if (rerenderScheduled) return;
                rerenderScheduled = true;

                setTimeout(async () => {
                    rerenderScheduled = false;
                    await render();
                }, 0);
            };

            const applyCard = async (filters, variables) => {
                for (const f of filters || []) {
                    if (f.field && f.value) {
                        await app.field(f.field).selectMatch(f.value, false);
                    }
                }
                for (const v of variables || []) {
                    if (v.name) {
                        await app.variable.setContent(v.name, v.value || "");
                    }
                }
            };

            const clearCard = async (filters, variables) => {
                for (const f of filters || []) {
                    if (f.field) {
                        await app.field(f.field).clear();
                    }
                }
                for (const v of variables || []) {
                    if (v.name) {
                        await app.variable.setContent(v.name, "");
                    }
                }
            };

            const render = async () => {
                if (renderBlocked) return;

                const vis = await app.visualization.get(visualizationId);
                const sourceLayout = await vis.model.getLayout();

                const rows = sourceLayout.cards || [];
                const customCss = sourceLayout.customCss || "";

                const html = `
          <style>
            ${customCss}
          </style>

          <div class="kpi-container">
            ${rows.map(r => `
              <div class="kpi-card ${lockedTitle === r.title ? "selected" : ""}"
                   data-title="${r.title || ""}"
                   data-sheet="${r.navigateSheetId || ""}"
                   data-filters='${JSON.stringify(r.filters || [])}'
                   data-variables='${JSON.stringify(r.variables || [])}'
                   style="color:${r.color || "#0078d4"}">
                <div class="kpi-title">${r.title || ""}</div>
                <div class="kpi-value">${r.value || ""}</div>
                <div class="kpi-description">${r.description || ""}</div>
              </div>
            `).join("")}
          </div>
        `;

                $element.html(html);

                $element.find(".kpi-card").each(function() {
                    const $card = $(this);
                    const title = $card.data("title");
                    const sheetId = $card.data("sheet");
                    const filters = JSON.parse($card.attr("data-filters") || "[]");
                    const variables = JSON.parse($card.attr("data-variables") || "[]");

                    // ===== HOVER =====
                    $card.on("mouseenter", async () => {
                        if (lockedTitle !== null) return;
                        if (hoveredTitle === title) return;

                        hoveredTitle = title;
                        renderBlocked = true;

                        await applyCard(filters, variables);

                        renderBlocked = false;
                        scheduleRender();
                    });

                    $card.on("mouseleave", async () => {
                        if (lockedTitle !== null) return;
                        if (hoveredTitle !== title) return;

                        hoveredTitle = null;
                        renderBlocked = true;

                        await clearCard(filters, variables);

                        renderBlocked = false;
                        scheduleRender();
                    });

                    // ===== CLICK =====
                    $card.on("click", async (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        renderBlocked = true;

                        if (lockedTitle === title) {
                            lockedTitle = null;
                            await clearCard(filters, variables);
                        } else {
                            if (lockedTitle) {
                                const prev = rows.find(r => r.title === lockedTitle);
                                if (prev) {
                                    await clearCard(prev.filters, prev.variables);
                                }
                            }
                            lockedTitle = title;
                            await applyCard(filters, variables);
                        }

                        if (sheetId) {
                            qlik.navigation.gotoSheet(sheetId);
                        }

                        renderBlocked = false;
                        scheduleRender();
                    });
                });
            };

            await render();

            const vis = await app.visualization.get(visualizationId);
            vis.model.on("changed", () => {
                if (!renderBlocked) {
                    render();
                }
            });
        }
    };
});
