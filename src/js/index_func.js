var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    } 
  });
}

// init canvas
var canvas = document.getElementById("modelCanvas");
canvas.width = document.getElementById("container").offsetWidth;  //window.innerWidth - document.getElementById("right").offsetWidth;
canvas.height = window.innerHeight - document.getElementById("top").offsetHeight;
