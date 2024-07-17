define(['qlik', 'jquery'], function (qlik, $) {
    'use strict';
    return {
        initialProperties: {
            version: 1.0,
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [{
                    qWidth: 2,
                    qHeight: 50
                }]
            }
        },
        definition: {
            type: "items",
            component: "accordion",
            items: {
                settings: {
                    uses: "settings",
                    items: {
                        visualizationId: {
                            type: "string",
                            label: "Visualization ID",
                            ref: "props.visualizationId",
                            expression: "optional"
                        }
                    }
                }
            }
        },
        paint: async function ($element, layout) {
            const app = qlik.currApp(this);
            const vizId = layout.props.visualizationId;

            // Clear the element
            $element.empty();

            // Append the HTML structure
            $element.append('<div class="json-display-extension"><textarea id="json-output" readonly></textarea></div>');

            // Apply CSS styles
            $element.find('.json-display-extension').css({
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px',
                boxSizing: 'border-box'
            });

            $element.find('#json-output').css({
                width: '100%',
                height: '100%',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '10px',
                boxSizing: 'border-box',
                fontFamily: 'monospace',
                whiteSpace: 'pre'
            });

            if (vizId) {
                try {
                    const model = await app.getObject(vizId);
                    const properties = await model.getProperties();
                    const layout = await model.getLayout();

                    const propsJson = JSON.stringify(properties, null, 4);
                    const layoutJson = JSON.stringify(layout, null, 4);

                    $element.find('#json-output').text(propsJson + '\n\n' + layoutJson);
                } catch (error) {
                    $element.find('#json-output').text('Error fetching visualization data: ' + error.message);
                }
            } else {
                $element.find('#json-output').text('Please provide a Visualization ID.');
            }
        }
    };
});
