var onLoadShow = function ()    {
    console.log('This is working');
     
    var canvas = document.getElementById('gameSurface');
    
    var gl = canvas.getContext('webgl');
    
    // for IE web browser, need to go for 'experimental-webgl'
    if(!gl) {
        console.log('WebGL not supported \n falling back on experimental-webgl');
        gl = canvas.getContext('experimental-webgl');
    }
    
    if(!gl) {
        alert('Your browser does not support WebGL');
    }
    
    // Adjust the canvas based on screen size
    {
        canvas.width = 0.6 * window.innerWidth;
        canvas.height = 0.6 * window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    
    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
}