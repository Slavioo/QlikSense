define(['jquery', 'qlik', 'css!./style.css'], function($, qlik) {
    return {
        initialProperties: {
            version: 1.0,
            text: '',
            fontColor: '#333',
            backgroundColor: '#fff',
            borderColor: '#ddd',
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
            var tooltip = layout.tooltip;

            $element.css({
                'display': 'flex',
                'justify-content': 'center',
                'align-items': 'center',
                'height': '100%',
                'font-family': 'Arial, sans-serif',
                'font-size': '16px',
                'line-height': '1.5',
                'color': fontColor,
                'background-color': backgroundColor,
                'border': '1px solid ' + borderColor,
                'padding': '10px',
                'border-radius': '5px',
                'box-shadow': '0 2px 5px rgba(0, 0, 0, 0.15)',
                'transition': 'all 0.3s ease'
            });
            $element.attr('title', tooltip);
            $element.html(text);
        }
    };
});
