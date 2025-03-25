// Código corresponte ao vertex shader 
var codigoVertexShader = [ 
    'precision mediump float;', // indica qual a precisão do tipo float 
    // Variável read-only do tipo vec3 que indicará a posição de um vértice 
    'attribute vec3 vertexPosition;', 
    'attribute vec2 texCoords;',
    // Variável read-only-do-tipo-vec3 que indicará a cor de um vértice 
    //'attribute vec3 vertexColor;', 
    // Variável que serve de interface entre o vertex shader e o fragment shader 
    //'varying vec3 fragColor;', 
    'varying vec2  fragTexCoords;',
    ,
    // Matriz 4X4 que indica quais as transformações que devem ser feitas a cada um dos vértices.
    'uniform mat4 transformationMatrix;',
    'uniform mat4 visualizationMatrix;',
    'uniform mat4 projectionMatrix;',
    'uniform mat4 viewportMatrix;',
    ,

    'void main() {', 
    // Dizemos ao fragment shader qual a cor do vértice. 
    //'   fragColor= vertexColor;', 
    '   fragTexCoords= texCoords;',
    // gl_Position é uma variável própria do Shader que indica a posição do vértice. 
    //-Esta variável é do tipo vec4 e a variável vertexPosition é do tipo-vec3. 
    // Por esta razão temos que colocar 1.0 como último elemento. 
    '   gl_Position = vec4(vertexPosition, 1.0) * transformationMatrix * visualizationMatrix * projectionMatrix * viewportMatrix;', 
    '}' 
    ].join('\n'); 
    // Código-corresponte ao fragment shader 
var codigoFragmentShader = [ 
    'precision mediump float;', // indica qual a precisão do tipo float 
    // Variável que serve de interface entre o vertex shader e o fragment-shader 
    //'varying vec3 fragColor;', 
    'varying vec2 fragTexCoords;',
    'uniform sampler2D sampler;',
    'void main(){', 
    // gl_FragColor é uma variável própria do Shader que indica qual a cor do vértice 
    // Esta variável é do tipo vec4 e a variável fragColor é do tipo vec3. 
    // Por esta razão temos que colocar 1.0 como último elemento. 
    //'   gl_FragColor = vec4(fragColor, 1.0);', 
    'gl_FragColor=texture2D(sampler,fragTexCoords);',
    '}' 
].join('\n');