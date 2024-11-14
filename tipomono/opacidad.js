'use strict'

document.querySelector('#input_opacidad').addEventListener('input', evt => {
    const opacidad = evt.target.value;
    document.querySelector('#fondo').style.opacity = opacidad/100;
});