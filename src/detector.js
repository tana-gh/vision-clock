
const detector = {
    webgl: (() => {
        try {
            const canvas = document.createElement('canvas');
            const webGLContext = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            return !!(window.WebGLRenderingContext && webGLContext && webGLContext.getShaderPrecisionFormat);
        } catch {
            return false;
        }
    })()
}

export default detector
