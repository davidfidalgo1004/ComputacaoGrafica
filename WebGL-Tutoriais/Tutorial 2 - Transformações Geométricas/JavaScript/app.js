//É necessário um elemento HTML o tipo canvas
var canvas = document.createElement('canvas');

//Tamanho
canvas.height = window.innerHeight-100;
canvas.width=window.innerWidth-15;

//Biblioteca Gráfica (GL-> Graphic Library)
var GL = canvas.getContext('webgl');


var vertexShader = GL.createShader(GL.VERTEX_SHADER);
var fragmentShader = GL.createShader(GL.FRAGMENT_SHADER);
var program = GL.createProgram();
var gpuArrayBuffer = GL.createBuffer();

var finalMatrixLocation;

var anguloDeRotacao=0;
//Funcao que prepara o canvas
function PrepareCanvas(){

    GL.clearColor(0.65,0.65,0.65,1.0);

    //Limpa os buffers
    GL.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT);

    //Adiciona o canvas ao documento
    document.body.appendChild(canvas);

    // Texto
    canvas.insertAdjacentText('afterend', 'O Canvas encontra se em cima deste texto!');
}

//-Função responsável por preparar-os-shaders. 
function PrepareShaders() 
    { 
    // Atribui o código que está no ficheiro "shaders.js" ao vertexShader. 
    GL.shaderSource(vertexShader, codigoVertexShader); 
    // Atribui o código que está no ficheiro "shaders.js" ao fragmentShader. 
    GL.shaderSource(fragmentShader, codigoFragmentShader); 
    // Esta linha de código compila o shader passado por parametro. 
    GL.compileShader (vertexShader); // Compila o vertexShader. 
    GL.compileShader (fragmentShader); // Compila o fragmentShader. 
    // Depois de compilado os shaders é necessário verificar se ocurreu algum-erro 
    // durante a compilação. Para o vertex shader usamos o código abaixo. 
    if(!GL.getShaderParameter (vertexShader, GL.COMPILE_STATUS)) { 
        console.error("ERRO: A compilação do vertex shader lançou uma excepção!", 
        GL.getShaderInfoLog(vertexShader)); 
    } 
    // Depois de compilado os shaders é necessário verificar-se ocurreu algum-erro 
    // durante a compilação. Para o fragment shader usamos o código abaixo. 
    if(!GL.getShaderParameter (fragmentShader, GL.COMPILE_STATUS)){ 
        console.error("ERRO: A compilação do fragment shader lançou uma excepção!", 
        GL.getShaderInfoLog(fragmentShader)); 
    }
}

// Função reponsável por preparar o Programa que irá correr sobre a GPU 
function PrepareProgram(){ 
    // Depois de teres os shaders criados e compilados é necessário dizeres ao program 
    // para utilizar esses mesmos shaders. Para isso utilizamos o código seguinte. 
    GL.attachShader(program, vertexShader); 
    GL.attachShader(program, fragmentShader); 
    // Agora que já atribuiste os shaders, é necessário dizeres à GPU que acabaste de 
    // configurar-o-program. Uma boa prática é verificar se existe algum erro-no-program 
    GL.linkProgram(program); 
    if(!GL.getProgramParameter (program, GL.LINK_STATUS)){ 
    console.error("ERRO:: 0 linkProgram lançou uma excepção!", GL.getProgramInfoLog(program)); 
    } 
    //-É-boa prática verificar-se o programa foi conectado corretamente e se pode ser 
    // utilizado. 
    GL.validateProgram(program); 
    if(!GL.getProgramParameter(program, GL.VALIDATE_STATUS)){ 
    console.error("ERRO:: A validação do program lançou uma excepção!", GL.getProgramInfoLog(program)); 
    } 
    // Depois de tudo isto, é necessário dizer que queremos utilizar este program. Para isso 
    // utilizamos o seguinte código 
    GL.useProgram(program);
}

// Função resposável por criar guardar a posição XYZ e cor RBG de cada um dos vértices do triângulo. 
// Esta função é também responsável por copiar essa mesma informação para um buffer que se encontra na GPU. 
function PrepareTriangleData(){ 
   var triangleArray = [ 
    -0.5, -0.5, 0.0, 1.0, 0.0, 0.0,
    0.5, -0.5, 0.0, 0.0, 1.0, 0.0,
    0.0, 0.5, 0.0, 0.0, 0.0, 1.0 
    ]; 
    // Esta linha de código indica à GPU-que-o-gpuArrayBuffer é do tipo ARRAY_BUFFER 
    GL.bindBuffer (GL.ARRAY_BUFFER, gpuArrayBuffer); 
    // Esta linha de código copia-o-array que acabamos de criar (triangleArray)-
    // para o buffer que está localizado na GPU (gpuArrayBuffer). 
    GL.bufferData( 
    // Tipo de buffer que estámos-a-utilizar. 
        GL.ARRAY_BUFFER, 
    // Dados que pretendemos passar para o buffer que se encontra na-GPU. 
    // Importante saber que no CPU os dados-do-tipo-float-utilizam 64bits-mas-a-GPU-só-trabalha com 
    // dados de 32bits. O-JavaScript-permite-nos-converter floats de 64bits para floats de 32bits utilizando 
    // a função a baixo. 
        new Float32Array(triangleArray), 
    //-Este parâmetro indica que os dados que são passados não vão ser alterados dentro-da-GPU. 
        GL.STATIC_DRAW 
    );
}

// Esta função é responsável por pegar na informação que se encontra no gpuArrayBuffer 
//-e atribuí-la ao vertex shader. 
function SendDataToShaders(){ 
    // A primeira coisa que é necessário fazer é ir buscar a posição de cada umas das variáveis dos Shaders. 
    // Se verificares o código dos shaders, é necessário passar informação para duas variáveis (vertexPosition 
    // e vertexColor). Para isso vamos utilizar o código abaixo. 
    var vertexPositionAttributeLocation = GL.getAttribLocation(program, "vertexPosition"); 
    var vertexColorAttributeLocation = GL.getAttribLocation(program, "vertexColor"); 
    // Esta função utiliza o último buffer que foi feito binding. Como podes ver pela função anterior 
    // o último buffer ao qual foi feito bind foi o gpuArrayBuffer, logo ele vai buscar informação a esse 
    // buffer-e-inserir essa informação no vertex shader. Vamos inserir os dados para a veriável vertexPosition. 
    GL.vertexAttribPointer( 
    // Localização da variável na qual pretendemos inserir a informação. No nosso caso a variável 
    // "vertexPosition" 
    vertexPositionAttributeLocation, 
    // Este parâmetro indica o quantos elementos vão ser usados pela variável. No nosso caso, a variável 
    // que irá utilizar estes valores é do tipo vec3 (XYZ) logo são 3 elementos. 
    3, 
    // Este parametro indica qual é o tipo dos objetos que estão nesse-buffer. No nossa caso são FLOATS. 
    GL.FLOAT, 
    // Este parâmetro indica se os dados estão ou não normalizados. Para já este parametro pode ser false. 
    false, 
    // Este parametro indica qual o tamanho de objetos que constituem cada ponto do triângulo em bytes. 
    // Cada ponto do triângulo é constituido por 6-valores (3 para posição X-Y-Ze-3-para-a-cor RGB)e 
    // o array que está no buffer e do tipo Float32Array. Float32Array tem uma propriedade que indica // qual o número de bytes que cada elemento deste tipo usa. Basta multiplicar 3 pelo numero de 
    //bytes de um elemento. 
    6* Float32Array.BYTES_PER_ELEMENT, 
    // Este parâmetro indica quando elementos devem ser ignorados no inicio para chegar aos valores que /
    // pretendemos utilizar. No nosso caso queremos utilizar os primeiros-3-elementos. Este valor também 
    // é em bytes logo multiplicamos pelo número de bytes de um Float32Array. 
    0* Float32Array.BYTES_PER_ELEMENT 
    );
    // Agora utilizando o mesmo método acima, vamos inserir os dados na variável vertexcolor. 
// Se prestares atenção nos parametros desta função, é bastante parecido ao método anterior, mudando apenas 
// a variável à qual prentendemos inserir os dados (vertexColor) e o último parâmetro (uma vez que agora 
// pretendemos ignorar os primeiros 3 valores que significam a posição de cada vértice) 
GL.vertexAttribPointer( 
    // Localização da variável na qual pretendemos inserir a informação. No nosso caso a variável 
    //-"vertexposition" 
    vertexColorAttributeLocation, 
    //Este parâmetro indica-o-quantos elementos vão ser usados pela variável. No nosso caso, a variável 
    // que irá utilizar estes valores é do tipo vec3 (XYZ) logo são 3 elementos. 
    3, 
    // Este parámetro indica qual é o tipo dos objetos que estão nesse buffer. No nossa caso são FLOATS. 
    GL.FLOAT, 
    // Este parâmetro indica se os dados estão ou não normalizados. Para já este parametro pode ser false. 
    false, 
    // Este parametro indica qual o tamanho de objetos que constituem cada ponto do triângulo em bytes. 
    // Cada ponto do triângulo é constituído por 6 valores (3 para posição XYZe 3 para a cor RGB) e 
    // o array que está no buffer e-do-tipo-Float32Array. Float32Array tem uma propriedade que indica-// qual o número de bytes que cada elemento deste tipo usa. Basta multiplicar-3-pelo-numero-de-
    //bytes de um elemento. 
    6 *Float32Array.BYTES_PER_ELEMENT, 
    // Este parâmetro indica quando elementos devem ser ignorados no inicio para chegar aos valores que 
    // pretendemos utilizar. No nosso caso queremos utilizar os primeiros 3 elementos. Este valor também 
    // é em bytes logo multiplicamos pelo número de bytes de um Float32Array. 
    3 *Float32Array.BYTES_PER_ELEMENT 
    ); 
    // Agora é necessário ativar os atributos que vão ser utilizados e para isso utilizamos a linha seguinte. 
    // Temos de fazer isso para cada uma das variáveis que pretendemos utilizar. 
    GL.enableVertexAttribArray (vertexPositionAttributeLocation); 
    GL.enableVertexAttribArray (vertexColorAttributeLocation); 
    // Indica que vais utilizar este programa 
    
    finalMatrixLocation = GL.getUniformLocation(program, 'transformationMatrix');
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

    finalMatrix = math.multiply(CriarMatrizEscala(0.25,0.25,0.25), finalMatrix);

    finalMatrix=math.multiply(CriarMatrizRotacaoY(anguloDeRotacao), finalMatrix);

    finalMatrix=math.multiply(CriarMatrizTranslacao(0.5,0.5,0), finalMatrix);

    var newarray=[];
    for(i=0; i<finalMatrix.length; i++){
        newarray = newarray.concat(finalMatrix[i]);
    }

    GL.uniformMatrix4fv(finalMatrixLocation, false, newarray);

    GL.drawArrays(GL.TRIANGLES, 0, 3);

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