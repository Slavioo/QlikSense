define(['jquery', 'qlik'], function($, qlik) {
    return {
        initialProperties: {
            version: 1.0,
            text: '',
            fontColor: '#000000',
            backgroundColor: '#ffffff',
            borderColor: '#000000',
            tooltip: '',
            css: ''
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
                        },
                        css: {
                            type: 'string',
                            ref: 'css',
                            label: 'CSS',
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
            var css = layout.css;

            $element.attr('style', css);
            $element.css('color', fontColor);
            $element.css('background-color', backgroundColor);
            $element.css('border', '1px solid ' + borderColor);
            $element.attr('title', tooltip);
            $element.html(text);
        }
    };
});
