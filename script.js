// Función para ocultar todas las pantallas y mostrar solo una
function mostrarPantalla(id) {
    const pantallas = document.querySelectorAll('.screen');
    pantallas.forEach(p => p.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

// Navegación entre pantallas
function goToDatos() {
    mostrarPantalla('datos');
}

function goToJuego() {
    mostrarPantalla('seleccion-juegos');
}


function goToNiveles() {
    mostrarPantalla('niveles');
}
//funcion juego de memoria 
function iniciarJuegoMemoria(nivel, imagenes) {
    mostrarPantalla(`memoria-${nivel}`);

    const tablero = document.getElementById(`tablero-${nivel}`);
    tablero.innerHTML = "";

    let cartas = [...imagenes, ...imagenes]; // Duplicar imágenes
    let cartasVolteadas = [];
    let bloquear = false;

    cartas.sort(() => Math.random() - 0.5); // Mezclar cartas

    cartas.forEach(nombre => {
        const carta = document.createElement("div");
        carta.classList.add("carta");
        carta.dataset.valor = nombre;

        // Define ruta para dorso y modo daltonismo
        const modoDaltonismo = document.body.classList.contains('colorblind-mode');
        const dorso = "img/dorso.png";
        const dorsoDaltonismo = "img/dorso_dal.png";
        const rutaDorso = modoDaltonismo ? dorsoDaltonismo : dorso;

        const img = document.createElement("img");
        img.src = rutaDorso;
        img.alt = "tapa";
        img.setAttribute("data-alt-src", dorsoDaltonismo);

        carta.appendChild(img);

        carta.addEventListener("click", () => {
            if (bloquear || carta.classList.contains("encontrada") || cartasVolteadas.includes(carta)) return;

            // Obtener nombre de imagen actual
            const valor = carta.dataset.valor;
            const rutaNormal = `img/${valor}`;
            const rutaDaltonismo = `img/${valor.replace(/\.(png|jpg|jpeg)$/i, '_dal.$1')}`;
            const rutaActual = modoDaltonismo ? rutaDaltonismo : rutaNormal;

            const imgCarta = carta.querySelector("img");
            imgCarta.src = rutaActual;
            imgCarta.setAttribute("data-alt-src", rutaDaltonismo);

            cartasVolteadas.push(carta);

            if (cartasVolteadas.length === 2) {
                bloquear = true;
                const [c1, c2] = cartasVolteadas;

                if (c1.dataset.valor === c2.dataset.valor) {
                    c1.classList.add("encontrada");
                    c2.classList.add("encontrada");
                    cartasVolteadas = [];
                    bloquear = false;

                    const encontradas = document.querySelectorAll(`#tablero-${nivel} .carta.encontrada`);
                    if (encontradas.length === cartas.length) {
                        setTimeout(() => {
                            mostrarPantalla('pantalla-victoria');
                        }, 300);
                    }

                } else {
                    setTimeout(() => {
                        const rutaReset = modoDaltonismo ? dorsoDaltonismo : dorso;

                        c1.querySelector("img").src = rutaReset;
                        c2.querySelector("img").src = rutaReset;

                        c1.querySelector("img").setAttribute("data-alt-src", dorsoDaltonismo);
                        c2.querySelector("img").setAttribute("data-alt-src", dorsoDaltonismo);

                        cartasVolteadas = [];
                        bloquear = false;
                    }, 1000);
                }
            }
        });

        tablero.appendChild(carta);
    });
}

//funcion juego facil 
function iniciarJuegoFacil() {
    const imagenesFacil = ['banano.png', 'manzana.png', 'sandia.png'];
    iniciarJuegoMemoria('facil', imagenesFacil);
}
//funcion juego intermedio 
function iniciarJuegoIntermedio() {
    const imagenesIntermedio = ['banano.png', 'manzana.png', 'sandia.png', 'naranja.png', 'pera.png', 'uva.png'];
    iniciarJuegoMemoria('intermedio', imagenesIntermedio);
}
//funcion juego intermedio 
function iniciarJuegoAvanzado() {
    const imagenesAvanzado = ['banano.png', 'manzana.png', 'sandia.png', 'naranja.png', 'pera.png', 'uva.png', 'kiwi.png', 'mango.png', 'piña.png', 'papaya.png'];
    iniciarJuegoMemoria('avanzado', imagenesAvanzado);
}

//reconocimiento por voz 
function iniciarReconocimiento(callback) {
    const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    reconocimiento.lang = 'es-ES';
    reconocimiento.interimResults = false;
    reconocimiento.maxAlternatives = 1;

    reconocimiento.onresult = function(event) {
        const resultado = event.results[0][0].transcript;
        callback(resultado);
    };

    reconocimiento.onerror = function(event) {
        alert("Error al reconocer la voz: " + event.error);
    };

    reconocimiento.start();
}

function dictarNombre() {
    iniciarReconocimiento((texto) => {
        document.getElementById("nombre").value = texto;
    });
}

function dictarEdad() {
    iniciarReconocimiento((texto) => {
        const numero = texto.match(/\d+/);
        if (numero) {
            document.getElementById("edad").value = numero[0];
        } else {
            alert("No entendí la edad, intenta otra vez.");
        }
    });
}
function goToSeleccionJuegos() {
    mostrarPantalla('seleccion-juegos');
}

function goToJuegoMemoria() {
    mostrarPantalla('juego');
}
function goToFlashcards() {
    mostrarPantalla('flashcards');
}

function goToNivelesFlashcards() {
    mostrarPantalla('niveles-flashcards');
}
// Flashcards - Nivel Fácil
const tarjetasFacil = [
    { palabra: "Ballena", imagen: "ballena.png" },
    { palabra: "Gato", imagen: "cat.png" },
    { palabra: "Perro", imagen: "dog.png" },
    { palabra: "León", imagen: "leon.png" },
    { palabra: "Serpiente", imagen: "serpiente.png" },
    { palabra: "Mono", imagen: "mono.png" }
];

let indiceFacil = 0;

function iniciarFlashcardsFacil() {
    indiceFacil = 0;
    mostrarFlashcardFacil();
}

function mostrarFlashcardFacil() {
    const card = tarjetasFacil[indiceFacil];
    const img = document.getElementById("imagen-facil");
    img.src = `img/${card.imagen}`;
    img.setAttribute("data-alt-src", `img/${card.imagen.replace(/\.(png|jpg|jpeg)$/i, '_dal.$1')}`);
    document.getElementById("texto-facil").textContent = card.palabra;
    mostrarPantalla("flashcards-facil");
}


function siguienteFacil() {
    indiceFacil = (indiceFacil + 1) % tarjetasFacil.length;
    mostrarFlashcardFacil();
}

function escucharPalabraFacil() {
    const palabra = tarjetasFacil[indiceFacil].palabra;
    const sintesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(palabra);
    utterance.lang = 'es-ES';
    sintesis.speak(utterance);
}
function decirPalabraFacil() {
    const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    reconocimiento.lang = 'es-ES';
    reconocimiento.interimResults = false;
    reconocimiento.maxAlternatives = 1;

    reconocimiento.onresult = function(event) {
        const dicho = event.results[0][0].transcript.trim().toLowerCase();
        const correcto = tarjetasFacil[indiceFacil].palabra.trim().toLowerCase();

        if (dicho === correcto) {
            document.getElementById("resultado-facil").textContent = "✅ ¡Muy bien!";
        } else {
            document.getElementById("resultado-facil").textContent = `❌ Dijiste "${dicho}", intenta otra vez.`;
        }
    };

    reconocimiento.onerror = function(event) {
        document.getElementById("resultado-facil").textContent = "❌ Error: " + event.error;
    };

    document.getElementById("resultado-facil").textContent = "🎤 Escuchando...";
    reconocimiento.start();
}

const tarjetasIntermedio = [
    { pregunta: "¿Cuántos gatos hay?", respuesta: "dos", imagen: "gatos_contar.png" },
    { pregunta: "¿Cuántas manzanas hay?", respuesta: "cuatro", imagen: "manzana_contar.png" },
    { pregunta: "¿Cuántos corazones hay?", respuesta: "ocho", imagen: "corazones_contar.png" }
];


let indiceIntermedio = 0;

function iniciarFlashcardsIntermedio() {
    indiceIntermedio = 0;
    mostrarFlashcardIntermedio();
}

function mostrarFlashcardIntermedio() {
    const card = tarjetasIntermedio[indiceIntermedio];
    const img = document.getElementById("imagen-intermedio");
    img.src = `img/${card.imagen}`;
    img.setAttribute("data-alt-src", `img/${card.imagen.replace(/\.(png|jpg|jpeg)$/i, '_dal.$1')}`);
    document.getElementById("pregunta-intermedio").textContent = card.pregunta;
    document.getElementById("resultado-intermedio").textContent = "";
    mostrarPantalla("flashcards-intermedio");
}

function siguienteIntermedio() {
    indiceIntermedio = (indiceIntermedio + 1) % tarjetasIntermedio.length;
    mostrarFlashcardIntermedio();
}

function escucharPreguntaIntermedio() {
    const texto = tarjetasIntermedio[indiceIntermedio].pregunta;
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
}

function decirRespuestaIntermedio() {
    const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    reconocimiento.lang = 'es-ES';
    reconocimiento.interimResults = false;
    reconocimiento.maxAlternatives = 1;

    reconocimiento.onresult = function(event) {
        const dicho = event.results[0][0].transcript.trim().toLowerCase();
        const correcto = tarjetasIntermedio[indiceIntermedio].respuesta.trim().toLowerCase();

        if (dicho === correcto) {
            document.getElementById("resultado-intermedio").textContent = "✅ ¡Correcto!";
        } else {
            document.getElementById("resultado-intermedio").textContent = `❌ Dijiste "${dicho}". Intenta otra vez.`;
        }
    };

    reconocimiento.onerror = function(event) {
        document.getElementById("resultado-intermedio").textContent = "❌ Error: " + event.error;
    };

    document.getElementById("resultado-intermedio").textContent = "🎤 Escuchando...";
    reconocimiento.start();
}

const tarjetasAvanzado = [
    { imagen: "niña_enojada.png", palabra: "enojada" },
    { imagen: "niña_corriendo.png", palabra: "corriendo" },
    { imagen: "niña_llorando.png", palabra: "llorando" },
    { imagen: "niño_cantando.png", palabra: "cantando" }
];


let indiceAvanzado = 0;

function iniciarFlashcardsAvanzado() {
    indiceAvanzado = 0;
    mostrarFlashcardAvanzado();
}

function mostrarFlashcardAvanzado() {
    const card = tarjetasAvanzado[indiceAvanzado];
    const img = document.getElementById("imagen-avanzado");
    img.src = `img/${card.imagen}`;
    img.setAttribute("data-alt-src", `img/${card.imagen.replace(/\.(png|jpg|jpeg)$/i, '_dal.$1')}`);
    document.getElementById("resultado-avanzado").textContent = "";
    mostrarPantalla("flashcards-avanzado");
}
function siguienteAvanzado() {
    indiceAvanzado = (indiceAvanzado + 1) % tarjetasAvanzado.length;
    mostrarFlashcardAvanzado();
}

function decirPalabraAvanzado() {
    const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    reconocimiento.lang = 'es-ES';
    reconocimiento.interimResults = false;
    reconocimiento.maxAlternatives = 1;

    reconocimiento.onresult = function(event) {
        const dicho = event.results[0][0].transcript.trim().toLowerCase();
        const correcto = tarjetasAvanzado[indiceAvanzado].palabra.toLowerCase();

        if (dicho === correcto) {
            document.getElementById("resultado-avanzado").textContent = "✅ ¡Muy bien!";
        } else {
            document.getElementById("resultado-avanzado").textContent = `❌ Dijiste "${dicho}", intenta otra vez.`;
        }
    };

    reconocimiento.onerror = function(event) {
        document.getElementById("resultado-avanzado").textContent = "❌ Error: " + event.error;
    };

    document.getElementById("resultado-avanzado").textContent = "🎤 Escuchando...";
    reconocimiento.start();
}
/*Daltonismo*/

function toggleClass(className) {
  document.body.classList.toggle(className);

  // Activar o desactivar imágenes para daltonismo
  if (className === 'colorblind-mode') {
    const isActive = document.body.classList.contains('colorblind-mode');
    document.querySelectorAll('img[data-alt-src]').forEach(img => {
      const originalSrc = img.getAttribute('src');
      const altSrc = img.getAttribute('data-alt-src');

      if (isActive) {
        img.setAttribute('data-original-src', originalSrc); // Guarda original
        img.setAttribute('src', altSrc); // Cambia a imagen adaptada
      } else {
        const original = img.getAttribute('data-original-src');
        if (original) {
          img.setAttribute('src', original);
        }
      }
    });
  }
}