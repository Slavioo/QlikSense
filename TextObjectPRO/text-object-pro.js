define(['jquery', 'qlik'], function($, qlik) {
    return {
        initialProperties: {
            version: 1.0,
            text: '',
            fontColor: '#333',
            backgroundColor: '#fff',
            borderColor: '#ddd',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
            tooltip: ''
        },
        definition: {
            type: 'items',
            component: 'accordion',
            items: {
                settings: {
                    uses: 'settings',
                    items: {
                        text: {
                            type: 'string',
                            ref: 'text',
                            label: 'Text',
                            expression: 'optional'
                        },
                        fontColor: {
                            type: 'string',
                            ref: 'fontColor',
                            label: 'Font Color',
                            expression: 'optional'
                        },
                        backgroundColor: {
                            type: 'string',
                            ref: 'backgroundColor',
                            label: 'Background Color',
                            expression: 'optional'
                        },
                        borderColor: {
                            type: 'string',
                            ref: 'borderColor',
                            label: 'Border Color',
                            expression: 'optional'
                        },
                        padding: {
                            type: 'string',
                            ref: 'padding',
                            label: 'Padding',
                            expression: 'optional'
                        },
                        borderRadius: {
                            type: 'string',
                            ref: 'borderRadius',
                            label: 'Border Radius',
                            expression: 'optional'
                        },
                        boxShadow: {
                            type: 'string',
                            ref: 'boxShadow',
                            label: 'Box Shadow',
                            expression: 'optional'
                        },
                        tooltip: {
                            type: 'string',
                            ref: 'tooltip',
                            label: 'Tooltip',
                            expression: 'optional'
                        }
                    }
                }
            }
        },
        paint: function($element, layout) {
            var text = layout.text;
            var fontColor = layout.fontColor;
            var backgroundColor = layout.backgroundColor;
            var borderColor = layout.borderColor;
            var padding = layout.padding;
            var borderRadius = layout.borderRadius;
            var boxShadow = layout.boxShadow;
            var tooltip = layout.tooltip;

            $element.css({
                'color': fontColor,
                'background-color': backgroundColor,
                'border': '1px solid ' + borderColor,
                'padding': padding,
                'border-radius': borderRadius,
                'box-shadow': boxShadow
            });
            $element.attr('title', tooltip);
            $element.html(text);
        }
    };
});
