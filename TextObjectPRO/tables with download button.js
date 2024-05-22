// Get all tables and the container
const tables = document.querySelectorAll('.table-container table');
const container = document.querySelector('.table-container');

// Calculate the height of each column
function calculateColumnHeights() {
  const columnHeights = Array.from(tables).map((table) => table.offsetHeight);
  return columnHeights;
}

// Distribute tables evenly based on column heights
function distributeTables() {
  const columnHeights = calculateColumnHeights();
  const maxHeight = Math.max(...columnHeights);

  tables.forEach((table, index) => {
    const heightDiff = maxHeight - columnHeights[index];
    table.style.marginBottom = `${heightDiff}px`;
  });
}

// Call the function initially and on window resize
distributeTables();
window.addEventListener('resize', distributeTables);
