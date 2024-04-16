define(['jquery', 'qlik', 'css!./style.css'], function($, qlik) {
    return {
        initialProperties: {
            version: 1.0,
            text: '',
            css: '',
            tooltip: '',
            contentType: 'text' // Default content type set to 'text'
        },
        definition: {
            type: 'items',
            component: 'accordion',
            items: {
                settings: {
                    uses: 'settings',
                    items: {
                        contentType: {
                            type: 'string',
                            component: 'dropdown',
                            ref: 'contentType',
                            label: 'Content Type',
                            options: [{
                                value: 'text',
                                label: 'Text'
                            }, {
                                value: 'html',
                                label: 'HTML'
                            }],
                            defaultValue: 'text'
                        },
                        text: {
                            type: 'stringExpression',
                            ref: 'text',
                            label: 'Content',
                            expression: 'optional',
                            show: function(data) {
                                return data.contentType === 'text'; // Only show this option if 'text' is selected
                            }
                        },
                        html: {
                            type: 'stringExpression',
                            ref: 'html',
                            label: 'HTML Content',
                            expression: 'optional',
                            show: function(data) {
                                return data.contentType === 'html'; // Only show this option if 'html' is selected
                            }
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
            var css = layout.css;
            var tooltip = layout.tooltip;

            $element.attr('style', css);
            $element.attr('title', tooltip);

            // Render content based on the selected content type
            if (layout.contentType === 'html') {
                $element.html(layout.html || ''); // Render HTML content
            } else {
                $element.text(layout.text || ''); // Render text content
            }
        }
    };
});
