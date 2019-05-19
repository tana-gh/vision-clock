uniform float u_rinner;
uniform float u_router;
uniform vec4  u_color;

varying vec4 v_coord;

void main() {
    float r = v_coord.x * v_coord.x + v_coord.y * v_coord.y;
    vec4  c = vec4(u_color.rgb * u_color.a, u_color.a);
    gl_FragColor =
        r < u_rinner ? c :
        r < u_router ? mix(vec4(0.0, 0.0, 0.0, 0.0), c, (u_router - r) / (u_router - u_rinner)) :
                       vec4(0.0, 0.0, 0.0, 0.0);
}
