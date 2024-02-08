/*precision mediump float;

uniform vec2 u_resolution;

void main() {
    // Normalize the coordinates to range [0, 1]
    vec2 uv = gl_FragCoord.xy / u_resolution;

    // Your shader code here...
    float distance = length(uv - vec2(0.5,0.5));
    float distanceSqrd = distance * distance;
    gl_FragColor = vec4(0.2/distanceSqrd, 0.1/distanceSqrd, 0.0, 1.0 );
    // For example, set the color to red
    //gl_FragColor = vec4(distance,0.0, 0.0,1.0);
}*/



// main.frag
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;

    // Example animation: move pixels horizontally based on time
    float xOffset = sin(u_time);
    uv.x += xOffset;

    gl_FragColor = vec4(uv, 0.0, 1.0);
}