uniform float u_rinner;
uniform float u_router;
uniform vec4  u_color;

varying vec4 v_coord;

void main() {
    float r = v_coord.x * v_coord.x + v_coord.y * v_coord.y;
    gl_FragColor =
        r < u_rinner ? u_color :
        r < u_router ? mix(vec4(0.0, 0.0, 0.0, 0.0), u_color, (u_router - r) / (u_router - u_rinner)) :
                       vec4(0.0, 0.0, 0.0, 0.0);
}
