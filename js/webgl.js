document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('background');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) {
        console.error('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    // Resize the canvas to fill the whole window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', function () {
        // Update the canvas size when the window is resized
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Update the resolution uniform
        gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

        // Set the viewport to match the new canvas size
        gl.viewport(0, 0, canvas.width, canvas.height);

        // Redraw
        draw();
    });

    // Vertex shader code (a simple pass-through shader)
    const vertexShaderSource = `
        attribute vec4 a_position;
        void main() {
            gl_Position = a_position;
        }
    `;

    // Fragment shader code (replace with your actual fragment shader)
    fetch('/js/main.frag')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(fragmentShaderSource => {
            console.log('Fragment shader code:', fragmentShaderSource);

            // Create shaders
            const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
            const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

            // Create program
            const program = createProgram(gl, vertexShader, fragmentShader);

            // Use the program
            gl.useProgram(program);

            // Set up the position attribute
            const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            const positions = [
                -1.0, -1.0,
                1.0, -1.0,
                -1.0,  1.0,
                1.0,  1.0,
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
            gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(positionAttributeLocation);

            // Set the resolution uniform
            const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
            gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

            // Set the viewport to match the initial canvas size
            gl.viewport(0, 0, canvas.width, canvas.height);


            const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
            
            // Render
            function draw() {
                // Calculate the elapsed time
                const currentTime = Date.now();
                const elapsedTime = (currentTime - startTime) / 1000.0;

                // Update the time uniform in the shader
                gl.uniform1f(timeUniformLocation, elapsedTime);
                
                
                gl.clearColor(0.0, 0.0, 0.0, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

                // Request the next animation frame
                requestAnimationFrame(draw);
            }

            const startTime = Date.now();

            draw();
        })
        .catch(error => console.error('Error loading fragment shader:', error));
});

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program linking error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }

    return program;
}
