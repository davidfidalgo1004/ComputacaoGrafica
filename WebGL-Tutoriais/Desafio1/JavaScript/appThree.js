import * as THREE from 'three';

document.addEventListener('DOMContentLoaded', Start);
console.log("Script carregar");
var cena = new THREE.Scene();
var camara = new THREE.OrthographicCamera(-1,1,1,-1,-10,10);
var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth -15, window.innerHeight-80);

renderer.setClearColor(0xaaaaaa);

document.body.appendChild(renderer.domElement);

var geometria = new THREE.BufferGeometry();
var vertices = new Float32Array([
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0,
    0.0, 0.5, 0.0
])

const cores = new Float32Array([
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,
])

geometria.setAttribute('position', new THREE.BufferAttribute( vertices, 3));
geometria.setAttribute('color', new THREE.BufferAttribute(new Float32Array(cores), 3));

var material = new THREE.MeshBasicMaterial({vertexColors: true , side: THREE.DoubleSide});

var mesh = new THREE.Mesh(geometria, material);
mesh.translateX(0.5);
mesh.translateY(0.5);
mesh.translateX(-1.2);
mesh.translateY(0.1);


mesh.scale.set(0.25,0.25,0.25);
mesh.scale.set(0.5,0.5,0.5);

function loop() {

    mesh.rotateY(Math.PI/180 * 5);
    mesh.rotateX(Math.PI/180 * 5);
    renderer.render(cena, camara);

    requestAnimationFrame(loop);
}


function Start(){
    console.log("Passei aqui!");
    cena.add(mesh);
    renderer.render(cena, camara);
    requestAnimationFrame(loop)
}