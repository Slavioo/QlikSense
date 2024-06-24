define([], function () {
    'use strict';

    return {
        paint: function ($element) {
            const matrix = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ]; // Your matrix data (1 to 9)

            const headers = ['Header 1', 'Header 2', 'Header 3'];

            const tableHtml = `
                <table>
                    <thead>
                        <tr>
                            ${headers.map(header => `<th>${header}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${matrix.map(row => `
                            <tr>
                                ${row.map(cell => `<td>${cell}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;

            $element.html(tableHtml);
        }
    };
});
