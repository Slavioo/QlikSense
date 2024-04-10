--IGNORE - or modify
define(['jquery', 'qlik', 'css!./style.css'], function($, qlik) {
    return {
        initialProperties: {
            version: 1.0,
            text: '',
            css: '',
            hoverCss: '',
            activeCss: '',
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
                        css: {
                            type: 'string',
                            ref: 'css',
                            label: 'CSS',
                            expression: 'optional'
                        },
                        hoverCss: {
                            type: 'string',
                            ref: 'hoverCss',
                            label: 'Hover CSS',
                            expression: 'optional'
                        },
                        activeCss: {
                            type: 'string',
                            ref: 'activeCss',
                            label: 'Active CSS',
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
            var css = layout.css;
            var hoverCss = layout.hoverCss;
            var activeCss = layout.activeCss;
            var tooltip = layout.tooltip;

            $element.attr('style', css);
            $element.attr('title', tooltip);
            $element.html(text);

            $element.hover(
                function() {
                    $(this).attr('style', hoverCss);
                }, function() {
                    $(this).attr('style', css);
                }
            );

            $element.mousedown(function() {
                $(this).attr('style', activeCss);
            });

            $element.mouseup(function() {
                $(this).attr('style', css);
            });
        }
    };
});
