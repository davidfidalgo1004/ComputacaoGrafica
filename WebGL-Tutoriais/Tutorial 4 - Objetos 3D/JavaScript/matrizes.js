/** 
* @param {float} x
* @param {float} y
* @param {float} z
*/

function CriarMatrizTranslacao(x,y,z){

    return[
        [1,0,0,x],
        [0,1,0,y],
        [0,0,1,z],
        [0,0,0,1]
    ];
}

/**
 * @param {float} x
 * @param {float} y
 * @param {float} z
 */

function CriarMatrizEscala(x,y,z){
    return[
        [x,0,0,0],
        [0,y,0,0],
        [0,0,z,0],
        [0,0,0,1]
    ];
}

/**
 * @param {float} angulo
 */

function CriarMatrizRotacaoX(angulo)
{
    var radianos = angulo * Math.PI/180;

    return[
        [1,0,0,0],
        [0,Math.cos(radianos),-Math.sin(radianos),0],
        [0,Math.sin(radianos),Math.cos(radianos),0],
        [0,0,0,1]
    ];
}

/**
 * @param {float} angulo
 */

function CriarMatrizRotacaoY(angulo)
{
    var radianos = angulo * Math.PI/180;

    return[
        [Math.cos(radianos),0,Math.sin(radianos),0],
        [0,1,0,0],
        [-Math.sin(radianos),0,Math.cos(radianos),0],
        [0,0,0,1]
    ];
}


/**
 * @param {float} angulo
 */

function CriarMatrizRotacaoZ(angulo)
{
    var radianos = angulo * Math.PI/180;

    return[
        [Math.cos(radianos),-Math.sin(radianos),0,0],
        [Math.sin(radianos),-Math.cos(radianos),0,0],
        [0,0,1,0],
        [0,0,0,1]
    ];
}