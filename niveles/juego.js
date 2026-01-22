let personaje1 = document.getElementById('personaje1');
let personaje2 = document.getElementById('personaje2');
let suelo = document.querySelector('.zona-suelo');
let plataformas = document.querySelectorAll('.plataforma');


let llave = document.getElementById('llave');
let puerta = document.getElementById('puerta');
let llaveCogida = false;

let trampolin = document.querySelectorAll('.trampolin');
let botones = document.querySelectorAll('.boton');
let plataformaMovil = document.getElementById('plataforma0');
let alturaPlataformaArriba = 100;
let alturaPlataformaAbajo = window.innerHeight * 0.8;
let p1X = 100;
let p1Y = 300;
let p2X = 300;
let p2Y = 300;

let velocidad = 5;
let saltoAltura = 150;

let tiempo = 0; 

let p1Saltando = false;
let p2Saltando = false;

let teclas = {};

window.addEventListener('keydown', (e) => {
    teclas[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    teclas[e.key] = false;
});

function comprobarLlaveYPuerta() {

    // detectar llave
    if (!llaveCogida) {
        if (
            (p1X + personaje1.offsetWidth > llave.offsetLeft &&
             p1X < llave.offsetLeft + llave.offsetWidth &&
             p1Y + personaje1.offsetHeight > llave.offsetTop &&
             p1Y < llave.offsetTop + llave.offsetHeight)
            ||
            (p2X + personaje2.offsetWidth > llave.offsetLeft &&
             p2X < llave.offsetLeft + llave.offsetWidth &&
             p2Y + personaje2.offsetHeight > llave.offsetTop &&
             p2Y < llave.offsetTop + llave.offsetHeight)
        ) {
            llaveCogida = true;
            llave.style.display = 'none';
            puerta.classList.add('puerta_abierta');
        }
    }

    // detectar puerta (solo si hay llave)
    if (llaveCogida) {
        let p1EnPuerta =
            p1X + personaje1.offsetWidth > puerta.offsetLeft &&
            p1X < puerta.offsetLeft + puerta.offsetWidth &&
            p1Y + personaje1.offsetHeight > puerta.offsetTop &&
            p1Y < puerta.offsetTop + puerta.offsetHeight;

        let p2EnPuerta =
            p2X + personaje2.offsetWidth > puerta.offsetLeft &&
            p2X < puerta.offsetLeft + puerta.offsetWidth &&
            p2Y + personaje2.offsetHeight > puerta.offsetTop &&
            p2Y < puerta.offsetTop + puerta.offsetHeight;

        if (p1EnPuerta && p2EnPuerta) {
            let currentPath = window.location.pathname;
            if (currentPath.endsWith('nivel1.html')) {
                window.location.href = 'nivel2.html';
            } else if (currentPath.endsWith('nivel2.html')) {
                window.location.href = '../fin.html';
            }
        }
    }
}

function moverPersonajes() {

    let p1EncimaPlataforma = false;
    let p2EncimaPlataforma = false;

    // PERSONAJE 1
    if (teclas['a']) p1X -= velocidad;
    if (teclas['d']) p1X += velocidad;

    if (teclas['w'] && !p1Saltando) {
        p1Y -= saltoAltura;
        p1Saltando = true;
    }

    // PERSONAJE 2
    if (teclas['ArrowLeft']) p2X -= velocidad;
    if (teclas['ArrowRight']) p2X += velocidad;

    if (teclas['ArrowUp'] && !p2Saltando) {
        p2Y -= saltoAltura;
        p2Saltando = true;
    }

    comprobarTrampolin();

    p1Y += 4;
    p2Y += 4;

    // COLISIÓN CON EL SUELO
    if (p1Y >= suelo.offsetTop - personaje1.offsetHeight) {
        p1Y = suelo.offsetTop - personaje1.offsetHeight;
        p1Saltando = false;
    }

    if (p2Y >= suelo.offsetTop - personaje2.offsetHeight) {
        p2Y = suelo.offsetTop - personaje2.offsetHeight;
        p2Saltando = false;
    }

    // COLISIÓN PLATAFORMAS
    plataformas.forEach(plataforma => {
        if (
            p1X + personaje1.offsetWidth > plataforma.offsetLeft &&
            p1X < plataforma.offsetLeft + plataforma.offsetWidth &&
            p1Y + personaje1.offsetHeight >= plataforma.offsetTop &&
            p1Y + personaje1.offsetHeight <= plataforma.offsetTop + 10
        ) {
            p1Y = plataforma.offsetTop - personaje1.offsetHeight;
            p1Saltando = false;
        }

        if (
            p2X + personaje2.offsetWidth > plataforma.offsetLeft &&
            p2X < plataforma.offsetLeft + plataforma.offsetWidth &&
            p2Y + personaje2.offsetHeight >= plataforma.offsetTop &&
            p2Y + personaje2.offsetHeight <= plataforma.offsetTop + 10
        ) {
            p2Y = plataforma.offsetTop - personaje2.offsetHeight;
            p2Saltando = false;
        }
    });

    // BOTONES Y PLATAFORMA
    logicaBotones();

    // APLICAR POSICIONES
    personaje1.style.left = p1X + 'px';
    personaje1.style.top = p1Y + 'px';

    personaje2.style.left = p2X + 'px';
    personaje2.style.top = p2Y + 'px';

    comprobarLlaveYPuerta();
    requestAnimationFrame(moverPersonajes);
}

moverPersonajes();
moverPersonajes();

function logicaBotones() {

    let alguienEnBoton = false;

    botones.forEach(boton => {

        // comprobar si p1 está sobre el botón
        if (
            p1X + personaje1.offsetWidth > boton.offsetLeft &&
            p1X < boton.offsetLeft + boton.offsetWidth &&
            p1Y + personaje1.offsetHeight > boton.offsetTop - 5 &&
            p1Y < boton.offsetTop + boton.offsetHeight
        ) {
            alguienEnBoton = true;
        }

        // comprobar si p2 está sobre el botón
        if (
            p2X + personaje2.offsetWidth > boton.offsetLeft &&
            p2X < boton.offsetLeft + boton.offsetWidth &&
            p2Y + personaje2.offsetHeight > boton.offsetTop - 5 &&
            p2Y < boton.offsetTop + boton.offsetHeight
        ) {
            alguienEnBoton = true;
        }
    });

    let p1EncimaPlataforma = false;
    let p2EncimaPlataforma = false;

    // si alguien está en el botón, la plataforma sube
    if (alguienEnBoton) {
        let diferencia = plataformaMovil.offsetTop - alturaPlataformaArriba;
        plataformaMovil.style.top = alturaPlataformaArriba + 'px';

        if (
            p1X + personaje1.offsetWidth > plataformaMovil.offsetLeft &&
            p1X < plataformaMovil.offsetLeft + plataformaMovil.offsetWidth &&
            p1Y + personaje1.offsetHeight <= plataformaMovil.offsetTop + diferencia + 5
        ) {
            p1Y -= diferencia;
            p1EncimaPlataforma = true;
        }

        if (
            p2X + personaje2.offsetWidth > plataformaMovil.offsetLeft &&
            p2X < plataformaMovil.offsetLeft + plataformaMovil.offsetWidth &&
            p2Y + personaje2.offsetHeight <= plataformaMovil.offsetTop + diferencia + 5
        ) {
            p2Y -= diferencia;
            p2EncimaPlataforma = true;
        }
    }

    // si nadie está en el botón Y nadie está encima, la plataforma baja
    if (!alguienEnBoton && !p1EncimaPlataforma && !p2EncimaPlataforma) {
        plataformaMovil.style.top = alturaPlataformaAbajo + 'px';
    }

    
}

function comprobarTrampolin() {
    trampolin.forEach(tramp => {
        if (
            p1X + personaje1.offsetWidth > tramp.offsetLeft &&
            p1X < tramp.offsetLeft + tramp.offsetWidth &&
            p1Y + personaje1.offsetHeight > tramp.offsetTop &&
            p1Y + personaje1.offsetHeight < tramp.offsetTop + tramp.offsetHeight
        ) {
            p1Y -= 300; 
            p1Saltando = true;
        }

        if (
            p2X + personaje2.offsetWidth > tramp.offsetLeft &&
            p2X < tramp.offsetLeft + tramp.offsetWidth &&
            p2Y + personaje2.offsetHeight > tramp.offsetTop &&
            p2Y + personaje2.offsetHeight < tramp.offsetTop + tramp.offsetHeight
        ) {
            p2Y -= 300;
            p2Saltando = true;
        }
    });


}


function actualizarReloj() {
    tiempo++;

    let minutos = Math.floor(tiempo / 60);
    let segundos = tiempo % 60;

    let texto = 
        (minutos < 10 ? "0" + minutos : minutos) + ":" + 
        (segundos < 10 ? "0" + segundos : segundos);

    let reloj = document.getElementById("reloj");
    if (reloj) {
        reloj.textContent = texto;
    }
}

setInterval(actualizarReloj, 1000);
