uniform float u_aspect;
uniform float u_radius;
uniform float u_arcy;
uniform float u_powinner;
uniform float u_powouter;
uniform vec4  u_bgcolor;
uniform vec4  u_arccolor;
uniform vec4  u_white;

varying vec4 v_coord;

void main() {
    float r = u_aspect * u_radius;
    float d = distance(v_coord.xy, vec2(0.0, -r + u_arcy));
    float a = d < r ? pow(d / r, u_powinner) : pow(r / d, u_powouter);

    gl_FragColor =
        u_bgcolor +
        mix(vec4(0.0, 0.0, 0.0, 1.0), u_white, a) +
        mix(vec4(0.0, 0.0, 0.0, 1.0), u_arccolor, a);
}
