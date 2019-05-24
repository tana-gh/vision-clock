uniform float u_aspect;
uniform vec4  u_color;

varying vec4 v_coord;

void main() {
    float r = u_aspect * 10.0;
    float d = distance(v_coord.xy, vec2(0.0, -r - 0.5));

    if (d < r) {
        float a = pow(d / r, 1000.0);
        gl_FragColor =
            mix(vec4(0.0, 0.0, 0.0, 1.0), vec4(0.4, 0.4, 0.4, 1.0), a) +
            mix(vec4(0.0, 0.0, 0.0, 1.0), u_color, a);
    }
    else {
        float a = pow(r / d, 200.0);
        gl_FragColor =
            mix(vec4(0.0, 0.0, 0.0, 1.0), vec4(0.4, 0.4, 0.4, 1.0), a) +
            mix(vec4(0.0, 0.0, 0.0, 1.0), u_color, a);
    }
}
