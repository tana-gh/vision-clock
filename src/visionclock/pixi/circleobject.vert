attribute vec4 a_position;
attribute vec4 a_coord;
attribute vec4 a_color;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_model;

varying vec4 v_coord;
varying vec4 v_color;

void main() {
    gl_Position = u_projection * u_view * u_model * a_position;
    v_coord     = a_coord;
    v_color     = a_color;
}
