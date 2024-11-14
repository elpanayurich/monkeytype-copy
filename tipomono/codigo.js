const time = document.querySelector("time");
const paragraph = document.querySelector("p");
const input_usuario = document.querySelector("input");

const juego = document.querySelector('#type');
const resultados = document.querySelector('#resultados');
const wpm = document.querySelector('h3');
const precision = document.querySelector('h3:last-child');

const subir =  document.querySelector("#subir");
const bajar = document.querySelector("#bajar");

const titulo = document.querySelector(".titulo");
const score = document.querySelector(".score");
const modo = document.querySelector("#modo");
const to_play = document.querySelector("#to_play");

const numeropal = document.querySelector("numeropal");

let intervalo;

let coordenadas;

let input_anterior = '';

let numpalabras = 30;
let palabras_correctas_totales = 0;
let letras_correctas_totales = 0;
let letras_incorrectas_totales = 0;

let tiempo_inicial = 30;
let clase;

let contador = 1;

let anterior_espacio = false;

function subir_tiempo() {
    if (current_time < 99) {
        current_time++;
        tiempo_inicial = current_time;
        time.textContent = current_time;
    }
}

function bajar_tiempo() {
    if (current_time > 10) {
        current_time--;
        tiempo_inicial = current_time;
        time.textContent = current_time;
    }
}

function get_random_words(numero) {
    let cadena = "";
    var palabra_random = "";
    for (let i = 1; i <= numero; i++) {
        palabra_random = todas_las_palabras[Math.floor(Math.random()*todas_las_palabras.length)];
        var palabrasepicas = cadena.trim().split(" ");
        let ultimaPalabra = palabrasepicas[palabrasepicas.length - 1];
        if (palabra_random !== ultimaPalabra) {
            cadena = cadena + palabra_random;
            if (i < numero) {
                cadena = cadena + " ";
            }
        } else {
            i--;
        }
    }
    return cadena;
}

let texto = get_random_words(30);
let divididas = texto.split(" ");

let last = divididas[divididas.length - 1];

let start = 0;
let palabras = [];
let current_time = tiempo_inicial;

initGame();
initEvents();

function initGame() {
    palabras = texto.split(" ").slice(0, numpalabras);
    if (modo_actual === 1) {
        current_time = tiempo_inicial;
    }
    else if (modo_actual === 2){
        current_time = 0;
    }
    time.textContent = current_time;

    paragraph.innerHTML = palabras.map((palabra, index) => {
        const letras = palabra.split("");

        return `<palabra>
        ${letras
            .map(letra => `<letra>${letra}</letra>`).
            join('')
        }
        </palabra>
        `
    }).join('');

    const first_palabra = paragraph.querySelector("palabra");
    
    first_palabra.classList.add("activa");
    first_palabra.querySelector("letra").classList.add("activa"); 
}   

function initEvents() {
    document.addEventListener('keydown', () => {
        input_usuario.focus();
    });
    input_usuario.addEventListener('keydown', start_game);
    input_usuario.addEventListener('keyup', onkeydown);
    input_usuario.addEventListener('keyup', onkeyup);
}

function start_game(event) {
    if (event.ctrlKey) {
        return;
    }
    if (start === 0) {
        const first_letra = paragraph.querySelector("letra");
        coordenadas = first_letra.getBoundingClientRect().top;  

        start = 1;
        numeropalabras.style.visibility = "hidden";
        titulo.style.visibility = "hidden";
        modo.style.visibility = "hidden";
        subir.style.display = "none";
        bajar.style.display = "none";
        to_play.textContent = "Presiona Enter para acabar";

        if (modo_actual === 1) {
            intervalo = setInterval(() => {
                current_time --;
                time.textContent = current_time;
                if(current_time === 0) {
                    clearInterval(intervalo);
                    if (start === 1) {
                        game_over();
                    }
                }
            }, 1000);
        } else if (modo_actual === 2){
            current_time = 0;
            intervalo = setInterval(() => {
                current_time ++;
                time.textContent = current_time;
            }, 1000);
        }
    }
}

function onkeydown(event) {
    if (event.ctrlKey) {
        return;
    }
    const palabra_activa = paragraph.querySelector('palabra.activa');
    const letra_activa = palabra_activa.querySelector('letra.activa');

    const { key } = event;
    
    if (key === "Enter") {
        if (start === 1) {
            game_over();
            return;
        }
        anterior_espacio = false;
    }

    if (key === " ") {
        event.preventDefault();
        if (!anterior_espacio) {
            contador += 1;
            anterior_espacio = true;
        }
        
        const siguiente_palabra = palabra_activa.nextElementSibling;
        const siguiente_letra = siguiente_palabra.querySelector("letra");

        var position = letra_activa.getBoundingClientRect();
        var position_next = siguiente_letra.getBoundingClientRect();

        palabra_activa.classList.remove('activa', 'subrayada');
        letra_activa.classList.remove('activa');

        siguiente_palabra.classList.add('activa');
        siguiente_letra.classList.add('activa');

        input_usuario.value = "";

        const fallada = palabra_activa.querySelectorAll('letra:not(.correcta)').length > 0;

        clase = fallada ? 'subrayada' : 'correcta';
        palabra_activa.classList.add(clase);

        const letras_sin_clase_correcta = palabra_activa.querySelectorAll('letra:not(.correcta)');

        letras_sin_clase_correcta.forEach((letra) => {
            letra.classList.add('incorrecta');
        });

        guardar_lineas(palabra_activa.innerText.trim(), position.top);
        check_borrar_linea(position_next.top);
        return;
    }

    if (key === 'Backspace') {
        anterior_espacio = false;
        const anterior_palabra = palabra_activa.previousElementSibling;
        const anterior_letra = letra_activa.previousElementSibling;

        if (!anterior_palabra && !anterior_letra) {
            event.preventDefault();
            return;
        }

        const marcada = paragraph.querySelector('palabra.subrayada');
        if (marcada && !anterior_letra) {
            if (input_anterior === '') {
                contador --;
                borrar_palabra(palabra_activa.innerText.trim());
            }
            event.preventDefault();
            anterior_palabra.classList.remove('subrayada');
            anterior_palabra.classList.add('activa');

            const letra_to_go = anterior_palabra.querySelector('letra:last-child');

            letra_activa.classList.remove('activa');
            letra_to_go.classList.add('activa');

            input_usuario.value = [...anterior_palabra.querySelectorAll('letra.correcta, letra.incorrecta')
            ].map(el => {
                return el.classList.contains('correcta') ? el.innerText : '*';
            }).join("");
        }
    }
}

function onkeyup(event) {
    if (event.ctrlKey) {
        return;
    }
    anterior_espacio = false;
    const palabra_activa = paragraph.querySelector('palabra.activa');
    const letra_activa = palabra_activa.querySelector('letra.activa');
    
    let ultima_letra = palabra_activa.querySelector('letra:last-child');

    let palabra_actual = palabra_activa.innerText.trim();
    input_usuario.maxLength = palabra_actual.length;

    const todas_letras = palabra_activa.querySelectorAll("letra");
    todas_letras.forEach(letra => letra.classList.remove('correcta', 'incorrecta'));

    input_usuario.value.split('').forEach((char, index) =>{
        const letra = todas_letras[index];
        const letra_check = palabra_actual[index];

        const correcta = char === letra_check;
        const clase = correcta ? 'correcta' : 'incorrecta';
        letra.classList.add(clase);
    });

    letra_activa.classList.remove("activa", 'ultima');
    const longitud_input = input_usuario.value.length;
    const siguiente_activa = todas_letras[longitud_input];
    if (siguiente_activa) {
        siguiente_activa.classList.add("activa")
    } else {
        letra_activa.classList.add('activa', 'ultima');
    }

    if (ultima_letra.classList.contains('incorrecta') || ultima_letra.classList.contains('correcta')) {
        letra_activa.classList.remove("activa", 'ultima');
        ultima_letra.classList.add('activa', 'ultima');
    }
    
    if (input_usuario.value === last && palabra_activa.innerText.trim() === last && modo_actual === 2 && contador >= numpalabras) {
        game_over();
    }
    input_anterior = input_usuario.value;
}

function game_over() {
    const palabra_activa = paragraph.querySelector('palabra.activa');
    const fallada = palabra_activa.querySelectorAll('letra:not(.correcta)').length > 0;
    clase = fallada ? 'subrayada' : 'correcta';
    palabra_activa.classList.add(clase);
    score.style.visibility = "visible";

    start = 0;
    juego.style.display = 'none';
    resultados.style.display = 'flex';

    const palabras_correctas = paragraph.querySelectorAll('palabra.correcta').length + palabras_correctas_totales;
    const letras_correctas = paragraph.querySelectorAll('letra.correcta').length + letras_correctas_totales;
    const letras_incorrectas = paragraph.querySelectorAll('letra.incorrecta').length + letras_incorrectas_totales;

    let total_letras = letras_correctas + letras_incorrectas;
    let porcentaje = total_letras > 0 ? (letras_correctas/total_letras) *100 : 0;
    let palabras_minuto;
    if (modo_actual === 1) {
        palabras_minuto = palabras_correctas * (60/(tiempo_inicial - current_time));
    } else if (modo_actual === 2){
        palabras_minuto = palabras_correctas * (60/current_time);
    }
   

    wpm.textContent = palabras_minuto.toFixed(0);
    precision.textContent = `${porcentaje.toFixed(2)}%`;
}
