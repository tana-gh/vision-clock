uniform vec4  u_color;

varying vec4 v_coord;

void main() {
    gl_FragColor = vec4(u_color.rgb * (v_coord.xyz + 1.0), u_color.a);
}
