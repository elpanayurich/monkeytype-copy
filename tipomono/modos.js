let modo_actual = 1;
const tiempo = document.querySelector("#modo1");
const text = document.querySelector("#modo2");
const numeropalabras = document.querySelector("#numeropalabras");

const totalpal = document.querySelector("#totalpal");

let fila_a_borrar = '';
let fila_a_borrar2 = '';

function modo_tiempo() {
    if (!tiempo.classList.contains('seleccionada')) {
        modo_actual = 1;
        current_time = 30;
        tiempo_inicial = 30;
        tiempo.classList.add('seleccionada');
        text.classList.remove('seleccionada');
        time.textContent = current_time;
        subir.style.visibility = "visible";
        bajar.style.visibility = "visible";
        numeropalabras.style.visibility = "hidden";
        if (numpalabras !== 30) {
            numpalabras = 30;
            texto = get_random_words(30);
            divididas = texto.split(" ");
            last = divididas[divididas.length - 1];
            initGame();
        }
    }
}

function modo_texto() {
    if (!text.classList.contains('seleccionada')) {
        modo_actual = 2;
        totalpal.textContent = numpalabras;
        text.classList.add('seleccionada');
        tiempo.classList.remove('seleccionada');
        time.textContent = "0";
        subir.style.visibility = "hidden";
        bajar.style.visibility = "hidden";
        numeropalabras.style.visibility = "visible";
    }
}

function subir_palabras() {
    if (numpalabras < 99) {
        numpalabras++;
        totalpal.textContent = numpalabras;
        texto = texto + " " + get_random_words(1);
        refresh_todo();
        if (modo_actual === 2) {
            time.textContent = "0";
        }
    }
}

function bajar_palabras() {
    if (numpalabras > 10) {
        numpalabras--;
        totalpal.textContent = numpalabras;
        var last_word = texto.lastIndexOf(" ");
        texto = texto.substring(0, last_word);
        refresh_todo();
        if (modo_actual === 2) {
            time.textContent = "0";
        }
    }
}

function refresh_todo() {
    initGame();
    divididas = texto.split(" ");
    last = divididas[divididas.length - 1];
}

function refresh_game() {
    input_usuario.value = '';
    clearInterval(intervalo);

    juego.style.display = 'block';
    resultados.style.display = 'none';
    modo.style.visibility = 'visible';
    titulo.style.visibility = "visible";
    score.style.visibility = "hidden";
    subir.style.display = "block";
    bajar.style.display = "block";
    to_play.textContent = "¡Escribe para empezar!";

    if (modo_actual === 2) {
        numeropalabras.style.visibility = "visible";
    }

    texto = get_random_words(30);
    palabras_correctas_totales = 0;
    letras_correctas_totales = 0;
    letras_incorrectas_totales = 0;
    fila_a_borrar = '';

    initGame();
} 

function guardar_lineas(word, posicion) {
    if (posicion === coordenadas){
        fila_a_borrar += word + ' ';
    }
}

function borrar_palabra(word) {
    fila_a_borrar = fila_a_borrar.trimEnd();
    fila_a_borrar = fila_a_borrar.replace(/\w+[.!?]?$/, '');
}

function check_borrar_linea(posicion) {
    if (posicion > coordenadas) {
        palabras_correctas_totales = palabras_correctas_totales + paragraph.querySelectorAll('palabra.correcta').length;
        letras_correctas_totales = letras_correctas_totales + paragraph.querySelectorAll('letra.correcta').length;
        letras_incorrectas_totales = paragraph.querySelectorAll('letra.incorrecta').length + letras_incorrectas_totales;
        texto = texto.replace(fila_a_borrar, '').trim();
        if (modo_actual === 1) {
            extra = get_random_words(10);
            texto = texto + ' ' + extra;
        }
        fila_a_borrar = '';

        palabras = texto.split(" ").slice(0, numpalabras);
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
}