attribute vec4 a_coord;

varying vec4 v_coord;

void main() {
    gl_Position = projectionMatrix * (modelViewMatrix * vec4(position, 1.0));
    v_coord     = a_coord;
}
