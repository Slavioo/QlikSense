='
body {
    font-family: Arial, sans-serif;
    font-size: 0.8vw; /* Smaller font size for better fit */
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    overflow: hidden;
}

.container.test1 {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    height: 100vh;
    overflow-y: auto; /* Single vertical scrollbar for the container */
}

.column.test1 {
    flex: 1;
    min-width: 30%;
    max-width: 32%;
    box-sizing: border-box;
    margin: 10px; /* Margin between columns */
}

.table-container.test1 {
    margin-bottom: 10px; /* Margin between tables */
}

.table-preview.test1 {
    width: 100%;
    border-collapse: collapse;
}

.table-container.test1 th, .table-container.test1 td {
    padding: 0.4vw; /* Smaller padding for better fit */
    text-align: left;
    border: 1px solid #ddd;
}

.table-container.test1 th {
    background-color: #f2f2f2;
    font-weight: bold;
}

.table-container.test1 tr {
    height: calc(100vh / 55); /* Ensure 50 records fit within the window size */
}

.table-container.test1 tr:hover {
    background-color: #f1f1f1; /* Highlight color on hover */
}

.highlight {
    background-color: #ffdddd; /* Highlight color for different values */
}
'
