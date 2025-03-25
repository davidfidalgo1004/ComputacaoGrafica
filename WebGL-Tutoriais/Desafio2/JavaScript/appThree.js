import * as THREE from 'three';

document.addEventListener('DOMContentLoaded', Start);


var cena = new THREE.Scene();
var camara = new THREE.OrthographicCamera(- 1, 1, 1, - 1, 0, 10);
var renderer = new THREE.WebGLRenderer();
var textura = new THREE.TextureLoader().load('./images/boxImage.jpg');
var materialTextura = new THREE.MeshBasicMaterial({map:textura});



var camaraPerspetiva = new THREE.PerspectiveCamera(45, 4/3, 0.1, 100);

renderer.setSize(window.innerWidth -15, window.innerHeight-80);

renderer.setClearColor(0xaaaaaa);

document.body.appendChild(renderer.domElement);


var geometria = new THREE.BufferGeometry();
var vertices = new Float32Array( [
	-0.5, -0.5, 0.0,
	 0.5, -0.5, 0.0,
	 0.0,  0.5, 0.0
] );


const cores = new Float32Array( [
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,
] );

geometria.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
geometria.setAttribute( 'color', new THREE.BufferAttribute(new Float32Array(cores), 3));

var material = new THREE.MeshBasicMaterial({vertexColors: true,side:THREE.DoubleSide});

var camara = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);

var mesh = new THREE.Mesh(geometria, material);



mesh.translateZ(-6.0);

//Variável relativa ao ângulo de rotacao
var anguloDeRotacao = 0;

function loop() {
    // Comentamos a linha que faz o triângulo rodar pois já não precisamos dela
    //mesh.rotateY(Math.PI/180 * 1);

    //Tal como fizemos inicialmente com o triângulo, vamos colocar o cubo a rodar no eixo do Y
    meshCubo.rotateX(Math.PI/180 * 1);

    //função chamada para gerarmos um novo frame
    renderer.render(cena, camaraPerspetiva);

    //função chamada para executar de novo a função loop de forma a gerar o frame seguinte
    requestAnimationFrame(loop);
}

//Criação da geometria de um cubo, com os parâmetros de largura, altura e profundidade de 1 unidade
var geometriaCubo = new THREE.BoxGeometry(1,1,1);
//Criação do material básico que vai permitir configurar o aspeto das faces do cubo
//Neste caso, ativamos a propriedade vertexColors para que possamos definir as cores dos vértices
var materialCubo = new THREE.MeshBasicMaterial( { vertexColors: true } );

//Definição das cores dos vértices do cubo
const vertexColorsCubo = new Float32Array( [
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 0.0,

    1.0, 0.0, 0.0,
    0.0, 0.0, 0.0,
    0.0, 0.0, 1.0,
    0.0, 1.0, 0.0,

    0.0, 0.0, 1.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 0.0,
    1.0, 0.0, 0.0,

    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,
    1.0, 0.0, 0.0,
    0.0, 0.0, 0.0,

    0.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,

    0.0, 1.0, 0.0,
    1.0, 0.0, 0.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 0.0,
] );

//Associar o array com as cores dos vértices à propriedade de cor da geometria
geometriaCubo.setAttribute( 'color', new THREE.Float32BufferAttribute( vertexColorsCubo, 3 ) );

var uvAttribute = geometriaCubo.getAttribute('uv');

// Face 1 (índices 0..3) => sub-textura (0 <= x <= 1/3, 0.5 <= y <= 1)
uvAttribute.setXY(0, 0, 0);  // canto inferior-esquerdo do quadrado
uvAttribute.setXY(1, 0, 1/3);  // canto inferior-direito
uvAttribute.setXY(2, 1/3, 0);  // canto superior-direito
uvAttribute.setXY(3, 1/3, 1/3);  // canto superior-esquerdo

// Face 2 (índices 4..7) => sub-textura (1/3 <= x <= 2/3, 0.5 <= y <= 1)
uvAttribute.setXY(4, 0, 1/3);
uvAttribute.setXY(5, 0, 2/3);
uvAttribute.setXY(6, 1/3, 1/3);
uvAttribute.setXY(7, 1/3, 2/3);

// Face 3 (índices 8..11) => sub-textura (2/3 <= x <= 1, 0.5 <= y <= 1)
uvAttribute.setXY(8,   2/3, 0);
uvAttribute.setXY(9,  1, 0);
uvAttribute.setXY(10, 2/3, 1/3);
uvAttribute.setXY(11, 1, 1/3);

// Face 4 (índices 12..15) => sub-textura (0 <= x <= 1/3, 0 <= y <= 0.5)
uvAttribute.setXY(12, 1/3, 1/3);
uvAttribute.setXY(13, 2/3, 1/3);
uvAttribute.setXY(14, 1/3, 2/3);
uvAttribute.setXY(15, 2/3, 2/3);

// Face 5 (índices 16..19) => sub-textura (1/3 <= x <= 2/3, 0 <= y <= 0.5)
uvAttribute.setXY(16, 1/3, 0.0);
uvAttribute.setXY(17, 2/3, 1/3);
uvAttribute.setXY(18, 1/3, 1/3);
uvAttribute.setXY(19, 2/3, 0);

// Face 6 (índices 20..23) => sub-textura (2/3 <= x <= 1, 0 <= y <= 0.5)
uvAttribute.setXY(20, 2/3, 1/3);
uvAttribute.setXY(21, 1.0, 1/3);
uvAttribute.setXY(22, 2/3, 2/3);
uvAttribute.setXY(23, 1, 2/3);


var meshCubo;
// Após criar a geometria e o material, criamos a mesh com os dados da geometria e do material.
meshCubo = new THREE.Mesh( geometriaCubo, materialTextura );


//Criamos uma translação no eixo do Z para que o triângulo fique dentro do volume de visualização
meshCubo.translateZ(-6.0);

function Start(){

    // Comentamos esta linha para o triângulo não ser adicionado
    //cena.add(mesh);

    //Adicionamos esta linha para adicionar o cubo à cena
    cena.add( meshCubo );

    renderer.render(cena, camaraPerspetiva);

    //Função para chamar a nossa função de loop
    requestAnimationFrame(loop);
}