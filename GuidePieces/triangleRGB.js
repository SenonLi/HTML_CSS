var onLoadShow = function ()    {
    console.log('This is working');
     
    var canvas = document.getElementById('gameSurface');
    
    var gl = canvas.getContext('webgl');
    
    if(!gl) {
        console.log('WebGL not supported \n falling back on experimental-webgl');
        gl = canvas.getContext('experimental-webgl');
    }
    
    if(!gl) {
        alert('Your browser does not support WebGL');
    }
    
}