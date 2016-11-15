precision mediump float;

struct DirectionalLight {
    vec3 direction;
    vec3 color;
};

varying vec2 TexCoords;
varying vec3 fragNormals;

uniform sampler2D Texture;

uniform vec3 ambientLightIntensity;
uniform DirectionalLight light;

void main()
{
    vec3 normNormals = normalize(fragNormals);
    vec4 texel = texture2D(Texture, TexCoords);
    vec3 normLightDirection = normalize(light.direction);
    
    vec3 lightIntensity = ambientLightIntensity + light.color * max(dot(normNormals, normLightDirection), 0.0);

    gl_FragColor = vec4(texel.rgb * lightIntensity, texel.a);
}