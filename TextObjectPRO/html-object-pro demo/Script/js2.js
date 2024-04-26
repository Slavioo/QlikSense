document.getElementById("kpi1").addEventListener("click", function(event) {
  toggleBackgroundAndText(this, "Javascript Test: $(=$(v_KpiValueDollars('DataSample15')))");
});
document.getElementById("kpi2").addEventListener("click", function(event) {
  toggleBackgroundAndText(this, "Javascript Test: $(=$(v_KpiValue('DataSample16')))");
});
document.getElementById("kpi3").addEventListener("click", function(event) {
  toggleBackgroundAndText(this, "Javascript Test: $(=$(v_KpiValue('DataSample17')))");
});
document.getElementById("kpi4").addEventListener("click", function(event) {
  toggleBackgroundAndText(this, "Javascript Test: $(=$(v_KpiValue('DataSample18')))");
});

function toggleBackgroundAndText(element, text) {
  element.classList.toggle("green");
  
  var extraText = element.querySelector(".extra-text");
  if (extraText) {
    element.removeChild(extraText);
  } else {
    extraText = document.createElement("div");
    extraText.className = "extra-text";
    extraText.textContent = text;
    element.appendChild(extraText);
  }
}