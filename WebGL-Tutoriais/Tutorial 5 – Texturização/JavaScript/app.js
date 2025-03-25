//É necessário um elemento HTML o tipo canvas
var canvas = document.createElement('canvas');

//Tamanho
canvas.height = window.innerHeight-100;
canvas.width=window.innerWidth-15;

//Biblioteca Gráfica (GL-> Graphic Library)
var GL = canvas.getContext('webgl');

var boxTexture = GL.createTexture();
var vertexShader = GL.createShader(GL.VERTEX_SHADER);
var fragmentShader = GL.createShader(GL.FRAGMENT_SHADER);
var program = GL.createProgram();
var gpuArrayBuffer = GL.createBuffer();

var finalMatrixLocation;
var visualizationMatrixLocation;
var projectionMatrixLocation;
var viewportMatrixLocation;
var anguloDeRotacao=0;
// Variável que irá guardar a posição dos vértices
var vertexPosition;

// Variável que irá guardar o conjunto de vértices que constituem cada triângulo
var vertexIndex;

// Buffer que irá guardar todos o conjunto de vértices na GPU
var gpuIndexBuffer = GL.createBuffer();

//Funcao que prepara o canvas
function PrepareCanvas(){

    GL.clearColor(0.65,0.65,0.65,1.0);

    //Limpa os buffers
    GL.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT);

    // Permite o teste de profundidade
    GL.enable(GL.DEPTH_TEST);

    // Permite visualizar apenas os triângulos que tiverem as normais viradas para a câmara.
    // As normais são calculadas através da ordem pela qual os triângulos forem desenhados.
    // No sentido contrário ao ponteiro do relógio a normal vai estar virada para a câmara,
    // caso contrário a normal vai estar a apontar na mesma direção que a câmara logo não sera visualizada.
GL.enable(GL.CULL_FACE);

    //Adiciona o canvas ao documento
    document.body.appendChild(canvas);

    // Texto
    canvas.insertAdjacentText('afterend', 'O Canvas encontra se em cima deste texto!');
}

function PrepareShaders() 
    { 
    GL.shaderSource(vertexShader, codigoVertexShader); 
    GL.shaderSource(fragmentShader, codigoFragmentShader); 
   
    GL.compileShader (vertexShader); 
    GL.compileShader (fragmentShader); 
     
    if(!GL.getShaderParameter (vertexShader, GL.COMPILE_STATUS)) { 
        console.error("ERRO: A compilação do vertex shader lançou uma excepção!", 
        GL.getShaderInfoLog(vertexShader)); 
    } 
   
    if(!GL.getShaderParameter (fragmentShader, GL.COMPILE_STATUS)){ 
        console.error("ERRO: A compilação do fragment shader lançou uma excepção!", 
        GL.getShaderInfoLog(fragmentShader)); 
    }
}

 
function PrepareProgram(){ 
    
    GL.attachShader(program, vertexShader); 
    GL.attachShader(program, fragmentShader); 
   
    GL.linkProgram(program); 
    if(!GL.getProgramParameter (program, GL.LINK_STATUS)){ 
    console.error("ERRO:: 0 linkProgram lançou uma excepção!", GL.getProgramInfoLog(program)); 
    } 
   
    GL.validateProgram(program); 
    if(!GL.getProgramParameter(program, GL.VALIDATE_STATUS)){ 
    console.error("ERRO:: A validação do program lançou uma excepção!", GL.getProgramInfoLog(program)); 
    } 
   
    GL.useProgram(program);
}


function PrepareTriangleData(){ 
   /* Foi removido o array que continha os vertices do triângulo.
    Assim como o array anterior, este novo array vai ter os diferentes posições de cada ponto.
    bem como o código de cores RGB de cada ponto.
    */
    vertexPosition = [
    // X,   Y,   Z,    U,    V
    // Frente
    0, 0, 0, 0, 0,
    0, 1, 0, 0, 1,
    1, 1, 0, 1, 1,
    1, 0, 0, 1, 0,

    // Direita
    1, 0, 0, 0, 0,
    1, 1, 0, 1, 0,
    1, 1, 1, 1, 1,
    1, 0, 1, 0, 1,

    // Trás
    1, 0, 1, 1, 0,
    1, 1, 1, 1, 1,
    0, 1, 1, 0, 1,
    0, 0, 1, 0, 0,

    // Esquerda
    0, 0, 1, 0, 1,
    0, 1, 1, 1, 1,
    0, 1, 0, 1, 0,
    0, 0, 0, 0, 0,

    // Cima
    0, 1, 0, 0, 0,
    0, 1, 1, 0, 1,
    1, 1, 1, 1, 1,
    1, 1, 0, 1, 0,

    // Baixo
    1, 0, 0, 0, 0,
    1, 0, 1, 0, 1,
    0, 0, 1, 0, 1,
    0, 0, 0, 0, 0  
    ];
    /* Array que guarda qual os indices do array anterior que constituem cada triângulo.
    De relembrar que cada lado do cubo é constituido por dois triângulos, por exemplo:
    a primeira linha é "0, 1, 2" isto significa que um dos triângulos da face da frente é
    formado pela 1ª, 2ª e 3ª linha (de relembrar que o indice do primeiro elemento
    num array é "0").
    */
    vertexIndex =[
    // Frente
    0, 2, 1,
    0, 3, 2,

    // Direita
    4, 6, 5,
    4, 7, 6,

    // Trás
    8, 10, 9,
    8, 11, 10,

    // Esquerda
    12, 14, 13,
    12, 15, 14,

    // Cima
    16, 18, 17,
    16, 19, 18,

    // Baixo
    20, 22, 21,
    20, 23, 22
    ];
   
    GL.bindBuffer(GL.ARRAY_BUFFER, gpuArrayBuffer);

    GL.bufferData(
    GL.ARRAY_BUFFER,
    new Float32Array(vertexPosition), // Não esquecer que agora é uma nova variável
    GL.STATIC_DRAW
    );

    // Voltamos a fazer bind ao novo buffer que acabamos de criar dizendo que o buffer agora
    // e de ELEMENT_ARRAY_BUFFER.
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, gpuIndexBuffer);
    // Passamos os dados relativos ao indices de cada triângulo
    GL.bufferData(
        GL.ELEMENT_ARRAY_BUFFER, // Indica que os dados são do tipo ELEMENT_ARRAY_BUFFER
        new Uint16Array(vertexIndex), // Agora os valores são do tipo Unsigned int 16
        GL.STATIC_DRAW
    );// Os valores são estáticos e não irão mudar ao longo do tempo

    GL.bindTexture(GL.TEXTURE_2D, boxTexture);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);

    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);

    GL.texImage2D(
        GL.TEXTURE_2D,
        0,
        GL.RGBA,
        GL.RGBA,
        GL.UNSIGNED_BYTE,
        document.getElementById('boxImage')
    )

}


function SendDataToShaders(){ 
   
    var vertexPositionAttributeLocation = GL.getAttribLocation(program, "vertexPosition"); 
    //var vertexColorAttributeLocation = GL.getAttribLocation(program, "vertexColor"); 
    var TexCoordAttributeLocation = GL.getAttribLocation(program, 'texCoords');

    GL.vertexAttribPointer(
        vertexPositionAttributeLocation,
        3,
        GL.FLOAT,
        false,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0 * Float32Array.BYTES_PER_ELEMENT
    )


    GL.vertexAttribPointer( 
   
    TexCoordAttributeLocation, 
  
    2, 
   
    GL.FLOAT, 
     
    false, 
    
    5* Float32Array.BYTES_PER_ELEMENT, 
    
    3* Float32Array.BYTES_PER_ELEMENT 
    );
   
    
    
    GL.enableVertexAttribArray (vertexPositionAttributeLocation); 
    GL.enableVertexAttribArray (TexCoordAttributeLocation); 
    
    
    finalMatrixLocation = GL.getUniformLocation(program, 'transformationMatrix');
    visualizationMatrixLocation = GL.getUniformLocation(program, 'visualizationMatrix');
    projectionMatrixLocation = GL.getUniformLocation(program, 'projectionMatrix');
    viewportMatrixLocation = GL.getUniformLocation(program, 'viewportMatrix');
}

function loop()
{

    canvas.width = window.innerWidth - 15;
    canvas.height = window.innerHeight - 100;
    GL.viewport(0,0,canvas.width, canvas.height);

    GL.useProgram(program);

    GL.clearColor(0.65,0.65,0.65,1.0);
    GL.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT);

    var finalMatrix = [
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,0,1]
    ];

    

    finalMatrix=math.multiply(CriarMatrizRotacaoX(anguloDeRotacao), finalMatrix);

    // Atualizamos esta linha para o triângulo "voltar" para o centro e criamos
    // uma translação no eixo do Z para que o triângulo fique dentro do volume de visualização
    // versão anterior: finalMatrix = math.multiply(CriarMatrizTranslacao(0.5,0.5, 0), finalMatrix);
    finalMatrix = math.multiply(CriarMatrizTranslacao(0,0,2), finalMatrix);

    var newarray=[];
    for(i=0; i<finalMatrix.length; i++){
        newarray = newarray.concat(finalMatrix[i]);
    }
    var visualizationMatrix = MatrizDeVisualizacao([1,0,0], [0,1,0], [0,0,1], [0,0,0]);
    var newVisualizationMatrix = [];
    for(i=0; i<visualizationMatrix.length; i++){
        newVisualizationMatrix = newVisualizationMatrix.concat(visualizationMatrix[i]);
    }

    var projectionMatrix = MatrizPerspetiva(1,4,3,0.1,100);

    var newprojectionMatriz = [];
    for(i=0; i<projectionMatrix.length; i++){
        newprojectionMatriz = newprojectionMatriz.concat(projectionMatrix[i]);
    }

    var viewportMatrix = MatrizViewport(-1,1,-1,1);
    var newViewportMatrix = [];
    for(i=0; i<viewportMatrix.length; i++){
        newViewportMatrix = newViewportMatrix.concat(viewportMatrix[i]);
    }


    GL.uniformMatrix4fv(finalMatrixLocation, false, newarray);

    GL.uniformMatrix4fv(visualizationMatrixLocation, false, newVisualizationMatrix);
    GL.uniformMatrix4fv(projectionMatrixLocation, false, newprojectionMatriz);
    GL.uniformMatrix4fv(viewportMatrixLocation, false, newViewportMatrix);

    // Agora, em vez de chamar-mos a função de drawArray, vamos chamar a função drawElements.
    // Esta função permite-nos utilizar vertexIndex para dizermos quais são os elementos que
    // constituem os triângulos.
    GL.drawElements(
    GL.TRIANGLES, // Queremos desenhar na mesma triângulos
    vertexIndex.length, // O número elementos que vão ser desenhados
    GL.UNSIGNED_SHORT, // Qual o tipo de elementos
    0 // Qual o offset para o primeiro elemento a ser desenhado
    );

    anguloDeRotacao +=1;

    requestAnimationFrame(loop);
}




function Start(){
    PrepareCanvas();
    PrepareShaders();
    PrepareProgram();
    PrepareTriangleData();
    SendDataToShaders();
    loop();
}