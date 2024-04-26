var scale = 1;
var treeWrapper = document.getElementById("treeWrapper");
var zoomInButton = document.getElementById("zoomIn");
var zoomOutButton = document.getElementById("zoomOut");

zoomInButton.addEventListener("click", function() {
  scale += 0.1;
  treeWrapper.style.transform = "scale(" + scale + ")";
});

zoomOutButton.addEventListener("click", function() {
  if (scale > 0.1) {
    scale -= 0.1;
    treeWrapper.style.transform = "scale(" + scale + ")";
  }
});