function downloadCustomTablesAsTXT(filename) {
  var txt = [];
  var tables = document.querySelectorAll(".table-container .custom-table"); // Only select tables with class 'custom-table'
  
  tables.forEach(function(table, index) {
    txt.push("Table " + (index + 1));
    var rows = table.querySelectorAll("tr");
    
    for (var i = 0; i < rows.length; i++) {
      var row = [], cols = rows[i].querySelectorAll("td, th");
      
      for (var j = 0; j < cols.length; j++) {
        var data = cols[j].innerText.replace(/"/g, '""');
        data = '"' + data + '"';
        row.push(data);
      }
      
      txt.push(row.join("\\t")); // Use tab as the separator
    }
    
    txt.push(""); // Add an empty line to separate tables
  });
  
  var txtFile = new Blob([txt.join("\\n")], {type: "text/plain"});
  var downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(txtFile);
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// Add event listener to the button
document.getElementById('download-btn').addEventListener('click', function() {
  downloadCustomTablesAsTXT('custom_tables.txt');
});
