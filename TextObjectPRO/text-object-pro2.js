define(['jquery', 'qlik', 'css!./style.css'], function($, qlik) {
    return {
        initialProperties: {
            version: 1.0,
            html: '',
            css: '',
            tooltip: ''
        },
        definition: {
            type: 'items',
            component: 'accordion',
            items: {
                settings: {
                    uses: 'settings',
                    items: {
                        html: {
                            type: 'string',
                            ref: 'html',
                            label: 'HTML',
                            expression: 'optional'
                        },
                        css: {
                            type: 'string',
                            ref: 'css',
                            label: 'CSS',
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
            var html = layout.html;
            var css = layout.css;
            var tooltip = layout.tooltip;

            $element.attr('style', css);
            $element.attr('title', tooltip);
            $element.html(html);
        }
    };
});
