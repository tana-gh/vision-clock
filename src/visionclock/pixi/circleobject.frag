precision mediump float;

uniform float u_rinner;
uniform float u_router;

varying vec4 v_coord;
varying vec4 v_color;

void main() {
    float r = v_coord.x * v_coord.x + v_coord.y * v_coord.y;
    gl_FragColor +=
        r < u_rinner ? v_color :
        r < u_router ? mix(vec4(0.0, 0.0, 0.0, 0.0), v_color, (r - u_rinner) / (u_router - u_rinner)) :
                       vec4(0.0, 0.0, 0.0, 0.0);
}
