define(["qlik", "https://cdn.jsdelivr.net/npm/chart.js"], function (qlik, Chart) {
    return {
        paint: function ($element) {
            // Define KPI data and chart data
            const kpiData = [
                { Title: "Efficiency", Value: "185%", Description: "Production Efficiency", Color: "#0078d4" },
                { Title: "Sales", Value: "$120K", Description: "Monthly Revenue", Color: "#f45b69" },
                { Title: "Retention", Value: "92%", Description: "Customer Retention", Color: "#3cb371" },
                { Title: "Growth", Value: "12%", Description: "Market Expansion", Color: "#ffb347" },
                { Title: "Satisfaction", Value: "89%", Description: "Customer Satisfaction", Color: "#9b59b6" },
                { Title: "Cost", Value: "$50K", Description: "Operational Expenses", Color: "#2e86de" }
            ];

            const chartData = [
                ["Label", "Efficiency<Prod>", "Efficiency<Para2>", "Efficiency<DEV>", "Sales<Prod>", "Retention<Prod>", "Growth<Prod>", "Satisfaction<Prod>", "Cost<Prod>"],
                ["Jan", 119, 100, 112, 65, 83, 24, 12, 64],
                ["Feb", 132, 110, 114, 55, 43, 28, 24, 73],
                ["Mar", 114, 90, 115, 88, 73, 27, 23, 81],
                ["Apr", 125, 89, 112, 63, 53, 21, 36, 99],
                ["May", 121, 87, 100, 87, 83, 18, 44, 104],
                ["Jun", 140, 77, 90, 75, 93, 28, 32, 111]
            ];

            const chartLabels = chartData.slice(1).map(row => row[0]);
            const chartHeaders = chartData[0].slice(1).map(header => header.replace(/<.*?>/g, '').trim());
            const chartSeriesLabels = chartData[0].slice(1).map(header => {
                const label = header.match(/<([^>]+)>/);
                return label ? label[1] : null;
            });

            // Generate the HTML layout for KPI cards
            const html = `
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .kpi-container {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    grid-gap: 16px;
                    width: 100%;
                    height: 100%;
                    padding: 16px;
                    overflow-y: auto;
                    overflow-x: hidden;
                }

                .kpi-card {
                    background-color: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    padding: 16px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    position: relative;
                    cursor: pointer;
                    transition: box-shadow 0.3s ease;
                }

                .kpi-card:hover {
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                }

                .kpi-title {
                    font-size: 1.2em;
                    font-weight: bold;
                    color: #333333;
                }

                .kpi-value {
                    font-size: 2em;
                    font-weight: bold;
                    margin: 8px 0;
                }

                .kpi-description {
                    font-size: 0.9em;
                    color: #777777;
                }

                .chart-container {
                    width: 90%;
                    height: 50%;
                }

                canvas {
                    display: block;
                }
            </style>
            <div class="kpi-container">
                ${kpiData.map(kpi => `
                    <div class="kpi-card" data-title="${kpi.Title}">
                        <div class="kpi-title">${kpi.Title}</div>
                        <div class="kpi-value" style="color: ${kpi.Color}">${kpi.Value}</div>
                        <div class="kpi-description">${kpi.Description}</div>
                        <div class="chart-container">
                            <canvas id="chart-${kpi.Title.replace(/\s/g, '')}"></canvas>
                        </div>
                    </div>
                `).join('')}
            </div>
            `;

            $element.html(html); // Inject the HTML into the Qlik element

            // Create charts for each KPI
            kpiData.forEach(kpi => {
                const chartIndices = chartHeaders.map((header, idx) => header === kpi.Title ? idx : -1).filter(idx => idx !== -1);
                if (chartIndices.length === 0) return;

                const chartValues = chartIndices.map(chartIndex => chartData.slice(1).map(row => row[chartIndex + 1])) ;

                const ctx = document.getElementById(`chart-${kpi.Title.replace(/\s/g, '')}`).getContext('2d');
                const datasets = chartValues.map((values, index) => {
                    const transparency = 1 - (index * 0.4);
                    const colorWithTransparency = `${kpi.Color}${Math.floor(transparency * 255).toString(16).padStart(2, '0')}`;
                    return {
                        label: chartSeriesLabels[index],
                        data: values,
                        borderColor: colorWithTransparency,
                        backgroundColor: `${colorWithTransparency}1A`,
                        borderWidth: 2,
                        pointRadius: 3,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: colorWithTransparency,
                        tension: 0.3
                    };
                });

                new Chart(ctx, {
                    type: 'line',
                    data: { labels: chartLabels, datasets: datasets },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: true, position: 'bottom', labels: { usePointStyle: true, boxWidth: 10, boxHeight: 10 } } },
                        scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: '#e0e0e0', lineWidth: 0.5 } } }
                    }
                });
            });
        }
    };
});
