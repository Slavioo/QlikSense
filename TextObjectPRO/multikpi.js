<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Responsive KPI Cards with Line Charts">
    <title>KPI Cards with Line Charts</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html, body {
            height: 100%;
            width: 100%;
            font-family: 'Roboto', Arial, sans-serif;
            background-color: #eef1f5;
        }

        .kpi-container {
            display: grid;
            grid-template-columns: repeat(6, 1fr); /* 6 cards per row */
            grid-gap: 16px; /* Space between cards */
            width: 100%;
            height: 100%;
            padding: 16px;
            overflow-y: auto; /* Vertical scrolling if needed */
            overflow-x: hidden; /* No horizontal scrolling */
        }

        .kpi-container::-webkit-scrollbar {
            width: 12px;
        }

        .kpi-container::-webkit-scrollbar-thumb {
            background: #cccccc;
            border-radius: 6px;
        }

        .kpi-container::-webkit-scrollbar-thumb:hover {
            background: #aaaaaa;
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
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .kpi-card:hover {
            transform: translateY(-5px);
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
            height: 50%; /* Dynamic chart height */
        }

        canvas {
            display: block;
        }

        /* Subtle Color Variants */
        .kpi-card:nth-child(1) .kpi-value { color: #0078d4; }
        .kpi-card:nth-child(2) .kpi-value { color: #f45b69; }
        .kpi-card:nth-child(3) .kpi-value { color: #3cb371; }
        .kpi-card:nth-child(4) .kpi-value { color: #ffb347; }
        .kpi-card:nth-child(5) .kpi-value { color: #9b59b6; }
        .kpi-card:nth-child(6) .kpi-value { color: #2e86de; }
    </style>
</head>
<body>
    <div class="kpi-container">
        <div class="kpi-card">
            <div class="kpi-title">Efficiency</div>
            <div class="kpi-value">85%</div>
            <div class="kpi-description">Production Efficiency</div>
            <div class="chart-container">
                <canvas id="chart1"></canvas>
            </div>
        </div>
        <div class="kpi-card">
            <div class="kpi-title">Sales</div>
            <div class="kpi-value">$120K</div>
            <div class="kpi-description">Monthly Revenue</div>
            <div class="chart-container">
                <canvas id="chart2"></canvas>
            </div>
        </div>
        <div class="kpi-card">
            <div class="kpi-title">Retention</div>
            <div class="kpi-value">92%</div>
            <div class="kpi-description">Customer Retention</div>
            <div class="chart-container">
                <canvas id="chart3"></canvas>
            </div>
        </div>
        <div class="kpi-card">
            <div class="kpi-title">Growth</div>
            <div class="kpi-value">12%</div>
            <div class="kpi-description">Market Expansion</div>
            <div class="chart-container">
                <canvas id="chart4"></canvas>
            </div>
        </div>
        <div class="kpi-card">
            <div class="kpi-title">Satisfaction</div>
            <div class="kpi-value">89%</div>
            <div class="kpi-description">Customer Satisfaction</div>
            <div class="chart-container">
                <canvas id="chart5"></canvas>
            </div>
        </div>
        <div class="kpi-card">
            <div class="kpi-title">Cost</div>
            <div class="kpi-value">$50K</div>
            <div class="kpi-description">Operational Expenses</div>
            <div class="chart-container">
                <canvas id="chart6"></canvas>
            </div>
        </div>
    </div>

    <script>
        const chartConfigs = [
            { id: 'chart1', data: [75, 80, 78, 85, 88, 90], color: '#0078d4' },
            { id: 'chart2', data: [100, 110, 120, 115, 118, 120], color: '#f45b69' },
            { id: 'chart3', data: [89, 90, 91, 92, 93, 92], color: '#3cb371' },
            { id: 'chart4', data: [10, 12, 11, 12, 13, 12], color: '#ffb347' },
            { id: 'chart5', data: [85, 87, 88, 89, 90, 89], color: '#9b59b6' },
            { id: 'chart6', data: [55, 50, 52, 51, 50, 50], color: '#2e86de' }
        ];

        chartConfigs.forEach(config => {
            const ctx = document.getElementById(config.id).getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        data: config.data,
                        borderColor: config.color,
                        backgroundColor: `${config.color}1A`,
                        borderWidth: 2,
                        pointRadius: 3,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: config.color,
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false } },
                        y: { beginAtZero: true, grid: { color: '#e0e0e0', lineWidth: 0.5 } }
                    }
                }
            });
        });
    </script>
</body>
</html>
