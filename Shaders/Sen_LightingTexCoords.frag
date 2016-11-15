precision mediump float;

varying vec2 TexCoords;
varying vec3 fragNormals;

uniform sampler2D Texture;

uniform vec3 ambientLightIntensity;
uniform vec3 sunlightIntensity;
uniform vec3 sunlightDirection;

void main()
{
    vec3 normalizedNormals = normalize(fragNormals);
    vec4 texel = texture2D(Texture, TexCoords);

    vec3 lightIntensity = ambientLightIntensity + sunlightIntensity * max(dot(normalizedNormals, sunlightDirection), 0.0);

    gl_FragColor = vec4(texel.rgb * lightIntensity, texel.a);
}