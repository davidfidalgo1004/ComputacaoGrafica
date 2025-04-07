var vertexPosition;
vertextPosition = [
    // X,    Y,    Z,    R,    G,    B
    // ... array data ...
];
GL.bufferData( 
    GL.ARRAY_BUFFER, 
    new Float32Array(vertextPosition),
    GL.STATIC_DRAW 
); 