var vertexShaderTest = [
    'precision mediump float;',
    '',
    'attribute vec3 vertPosition;',
    'attribute vec3 vertColor;',
    '',
    'uniform mat4 model;',
    'uniform mat4 view;',
    'uniform mat4 projection;',
    '',
    'varying vec3 toFragColor;',
    '',
    'void main()',
    '{',
    '   gl_Position = projection * view * model *  vec4(vertPosition, 1.0);',
    '   toFragColor = vertColor;',
    '}'
].join('\n');

var fragmentShaderText = [
    'precision mediump float;',
    '',
    'varying vec3 toFragColor;',
    '',
    'void main()',
    '{',
    '   gl_FragColor = vec4(toFragColor, 1.0);',
    '}'
].join('\n');

var onLoadShowTriangleRGB = function () {
    console.log('TriangleRGB onLoadShow is working');

    var canvas = document.getElementById('gameSurface');

    var gl = canvas.getContext('webgl');

    // for IE web browser, need to go for 'experimental-webgl'
    if (!gl) {
        console.log('WebGL not supported \n falling back on experimental-webgl');
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) {
        alert('Your browser does not support WebGL');
    }

    // Adjust the canvas based on screen size
    {
        canvas.width = 0.9 * window.innerWidth;
        canvas.height = 0.7 * window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    gl.clearColor(0.75, 0.85, 0.8, 1.0);

    //
    // Create shaders
    //
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderTest);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
        return;
    }
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
        return;
    }

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program!', gl.getProgramInfoLog(program));
        return;
    }

    //
    // Create buffer
    //
    var triangleVertices = [ //X,   Y             R,  G,  B
        0.0, 0.5, -0.0, 1.0, 0.0, 0.0,
        -0.5, -0.5, -0.0, 0.0, 1.0, 0.0,
        0.5, -0.5, -0.0, 0.0, 0.0, 1.0
    ];

    var triangleVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    var verPositionLocation = gl.getAttribLocation(program, 'vertPosition');
    var verColorLocation = gl.getAttribLocation(program, 'vertColor');

    gl.vertexAttribPointer(
        verPositionLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE, //
        6 * Float32Array.BYTES_PER_ELEMENT, // Size of an indivisual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    )
    gl.enableVertexAttribArray(verPositionLocation);

    gl.vertexAttribPointer(verColorLocation, 3, gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT
    )
    gl.enableVertexAttribArray(verColorLocation);


    var model = new Float32Array(16);
    var view = new Float32Array(16);
    var projection = new Float32Array(16);
    var identity = new Float32Array(16);
    mat4.identity(identity);
    mat4.lookAt(view, [0.0, 0.0, 2.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    mat4.perspective(projection, glMatrix.toRadian(45.0), canvas.width / canvas.height, 0.1, 100);

    //
    // Main render loop
    //
    // Commen JavaScript Animation
    ///*    var loop = function() {
    //        updateWorld();
    //        renderWorld();
    //        if (running)    {
    //            requestAnimationFrame(loop);
    //        }
    //    } */
    var angle = 0.0;
    var paintloop = function () {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        angle = performance.now() / 1000.0 / 6.0 * 2.0 * Math.PI;
        mat4.rotate(model, identity, angle, [0.0, 1.0, 0.0]);

        gl.useProgram(program);

        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'model'), gl.FALSE, model);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'view'), gl.FALSE, view);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'projection'), gl.FALSE, projection);

        gl.drawArrays(gl.TRIANGLES, 0, 3);


        requestAnimationFrame(paintloop);
    }
    requestAnimationFrame(paintloop);


}



//function vertexShader(vertPosition, vertColor)  {
//    return  {
//        fragColor: vertColor,
//        gl_Position: [vertPosition.x, vertPosition.y, 0.0, 1.0]
//    };
//}
