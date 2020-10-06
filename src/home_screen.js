function InitScreen() {
    var canvas = document.getElementById('glCanvas');

    let width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
  
    var height =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
    
    canvas.width = width - 30;
    canvas.height = height - 30;

    console.log("HELLO");

    var gl = canvas.getContext('webgl');

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

InitScreen();