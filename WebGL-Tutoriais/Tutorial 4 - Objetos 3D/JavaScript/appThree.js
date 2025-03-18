import * as THREE from 'three';

document.addEventListener('DOMContentLoaded', Start);


var cena = new THREE.Scene();
var camara = new THREE.OrthographicCamera(- 1, 1, 1, - 1, 0, 10);
var renderer = new THREE.WebGLRenderer();


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

var mesh = new THREE.Mesh(geometria, material );



mesh.translateZ(-6.0);

//Variável relativa ao ângulo de rotacao
var anguloDeRotacao = 0;

function loop() {
    // Comentamos a linha que faz o triângulo rodar pois já não precisamos dela
    //mesh.rotateY(Math.PI/180 * 1);

    //Tal como fizemos inicialmente com o triângulo, vamos colocar o cubo a rodar no eixo do Y
    meshCubo.rotateY(Math.PI/180 * 1);

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

var meshCubo;
// Após criar a geometria e o material, criamos a mesh com os dados da geometria e do material.
meshCubo = new THREE.Mesh( geometriaCubo, materialCubo );

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