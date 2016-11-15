var gl;
var meshLinkModel;

var onLoadShowJSON_Model = function ()    {
    loadTextResource('../Shaders/Sen_3D_NormalTexCoords.vert',
        function (verShErr, verShText) {
            if (verShErr) {
                alert('Fatal error getting vertex shader (see console)');
                console.error(verShErr);
            } else {
                loadTextResource('../Shaders/Sen_LightingTexCoords.frag',
                    function (fragShErr, fragShText) {
                        if (fragShErr)  {
                            alert('Fatal error getting fragment shader (see console)');
                            console.error(fragShErr);
                        }else   {
                            // Inside the JSON model: 
                            // vertices, textureCoords, face (indices)
                            loadJSONresourse('../Models/Susan/Susan.json',
                                function (modelErr, modelObj) {
                                    if (modelErr) {
                                        alert('Fatal error getting Susan model (see consol)');
                                        console.error(modelErr);
                                    } else {
                                        loadImage('../Models/Susan/SusanTexture.png',
                                            function (imgErr, img) {
                                                if (imgErr) {
                                                    alert('Fatal error getting Susan texture (see console)');
                                                    console.error(imgErr);
                                                }else   {
                                                    paintJSON_Model(verShText, fragShText, img, modelObj);
                                                }
                                            }
                                        );
                                    }
                                }
                            );   
                            //paintCube(verShText, fragShText);
                        }
                    }
                );
            }
        }
    );
}

var paintJSON_Model = function (vertexShaderText, fragmentShaderText, SusanImage, SusanModel) {
    console.log('This is working');

    meshLinkModel = SusanModel;
    
    var canvas = document.getElementById('gameSurface');
    gl = canvas.getContext('webgl');

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
    gl.enable(gl.DEPTH_TEST);

    //
    // Create shaders
    //
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
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
    //*******************************************************************
    //*******************************************************************
    var susanVertices = SusanModel.meshes[0].vertices;
    var susanTexCoords = SusanModel.meshes[0].texturecoords[0];
    var susanIndices = [].concat.apply([], SusanModel.meshes[0].faces);
    var susanNormals = SusanModel.meshes[0].normals;
    
    var susanPositionVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, susanPositionVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(susanVertices), gl.STATIC_DRAW);

    var verPositionLocation = gl.getAttribLocation(program, 'position');
    gl.vertexAttribPointer(
        verPositionLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE, //
        3 * Float32Array.BYTES_PER_ELEMENT, // Size of an indivisual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    );    
    gl.enableVertexAttribArray(verPositionLocation);

    //*******************************************************************
    var susanTexCoordsVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, susanTexCoordsVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(susanTexCoords), gl.STATIC_DRAW);
    
    var texPositionLocation = gl.getAttribLocation(program, 'texCoords');
    gl.vertexAttribPointer(texPositionLocation, 2, gl.FLOAT,
        gl.FALSE,
        2 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    gl.enableVertexAttribArray(texPositionLocation);

    //*******************************************************************
    var susanNormalsVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, susanNormalsVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(susanNormals), gl.STATIC_DRAW);
    
    var normalLocation = gl.getAttribLocation(program, 'normals');
    gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT,
        gl.FALSE,
        3 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    gl.enableVertexAttribArray(normalLocation);
    //*******************************************************************
    var susanEBO = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, susanEBO);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(susanIndices), gl.STATIC_DRAW);

    //*******************************************************************
    //*******************************************************************

    var textureSusan = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textureSusan);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    handleTextureLoaded(SusanImage, textureSusan);

    //*******************************************************************
    //*******************************************************************

    var model = new Float32Array(16);
    var view = new Float32Array(16);
    var projection = new Float32Array(16);
    var identity = new Float32Array(16);
    mat4.identity(identity);
    mat4.lookAt(view, [1.0, 2.0, -4.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    mat4.perspective(projection, glMatrix.toRadian(45.0), canvas.width / canvas.height, 0.1, 100);

    var xRotation = new Float32Array(16);
    var yRotation = new Float32Array(16);

    //
    // Main render loop
    //
    var angle = 0.0;
    var paintloop = function () {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        angle = performance.now() / 1000.0 / 6.0 * 2.0 * Math.PI;
        mat4.rotate(yRotation, identity, angle, [0.0, 1.0, 0.0]);
        mat4.rotate(xRotation, identity, angle / 4.0, [1.0, 0.0, 0.0]);
        mat4.mul(model, xRotation, yRotation);

        gl.useProgram(program);

        gl.uniform3f(gl.getUniformLocation(program, 'ambientLightIntensity'),
                     0.5, 0.5, 0.9);
        gl.uniform3f(gl.getUniformLocation(program, 'light.color'),
                     0.7, 0.6, 0.9);
        gl.uniform3f(gl.getUniformLocation(program, 'light.direction'),
                     1.0, 4.0, 0.0);

        
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'model'), gl.FALSE, model);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'view'), gl.FALSE, view);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'projection'), gl.FALSE, projection);

        
        gl.activeTexture(gl.TEXTURE0);

        gl.bindTexture(gl.TEXTURE_2D, textureSusan);
		gl.drawElements(gl.TRIANGLES, susanIndices.length, gl.UNSIGNED_SHORT, 0);

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.useProgram(null);

        requestAnimationFrame(paintloop);
    }
    requestAnimationFrame(paintloop);
}


function handleTextureLoaded(image, texture) {
    console.log("handleTextureLoaded, image = " + image);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
        gl.UNSIGNED_BYTE, image);

    gl.bindTexture(gl.TEXTURE_2D, null);
}
