    precision mediump float;
    
    attribute vec3 position;
    attribute vec2 texCoords;
    
    uniform mat4 model;
    uniform mat4 view;
    uniform mat4 projection;
    
    varying vec2 TexCoords;
    
    void main()
    {
       gl_Position = projection * view * model *  vec4(position, 1.0);
       TexCoords = texCoords;
    }