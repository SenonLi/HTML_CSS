precision mediump float;

attribute vec3 position;
attribute vec2 texCoords;
attribute vec3 normals;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

varying vec2 TexCoords;
varying vec3 fragNormals;

void main()
{
   gl_Position = projection * view * model *  vec4(position, 1.0);
   TexCoords = texCoords;

   //fragNormals = normals;// normals value in Model Space
   // We need normals values in World Space
   fragNormals = (model * vec4(normals, 1.0)).xyz;
}