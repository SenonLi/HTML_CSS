var vertexShaderTest = 
[
    'precision mediump float;',
    '',
    'attribute vec2 vertPosition;',
    '',
    'void main()',
    '{',
    '   gl_Position = vec4(vertPosition, 0.0, 1.0);',
    '}'    
].join('\n');

var fragmentShaderText =
[
    'precision mediump float;',
    '',
    'void main()',
    '{',
    '   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);',
    '}' 
].join('\n');

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
        canvas.width = 0.9 * window.innerWidth;
        canvas.height = 0.7 * window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    
    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);   
    
    //
    // Create shaders
    //
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    
    gl.shaderSource(vertexShader, vertexShaderTest);
    gl.shaderSource(fragmentShader, fragmentShaderText);
    
    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
        return;
    }
    gl.compileShader(fragmentShader);
     if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
        return;
    }   
}



//function vertexShader(vertPosition, vertColor)  {
//    return  {
//        fragColor: vertColor,
//        gl_Position: [vertPosition.x, vertPosition.y, 0.0, 1.0]
//    };
//}





















