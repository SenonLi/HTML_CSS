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
    
    canvas.width = 0.6 * window.innerWidth;
    canvas.height = 0.6 * window.innerHeight;
    
    
}