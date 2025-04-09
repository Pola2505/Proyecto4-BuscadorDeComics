// -------------------------------------------------------- VARIABLES --------------------------------------------------------

let page = 1;
let totalPages = 42;

// -------------------------------------------------------- FUNCIONES GENERALES --------------------------------------------------------

const $ = (elem) => document.querySelector(elem);
const $$ = (elem) => document.querySelectorAll(elem);

const mostrarElemento = (selectors) => {
    for (const selector of selectors) {
        selector.classList.remove('hidden');
    }
};

const ocultarElemento = (selectors) => {
    for (const selector of selectors) {
        selector.classList.add('hidden');
    }
};

// -------------------------------------------------------- ELEMENTOS DEL DOM --------------------------------------------------------

const $containerCharacters = $('#container-characters');
const $pagination = $('#pagination-list');
const $selectTipo = $('#tipo');
const $containerEpisodes = $('#container-episodes');
const $resultsNumber = $('#results-number');
const $btnBuscar = $('#btn-buscar');
const $inputBuscar = $('#input-buscar');
const $loader = $('#loader');

// -------------------------------------------------------- PINTAR PERSONAJES --------------------------------------------------------

const pintarPersonajes = (arrayCharacters) => {
    $containerCharacters.innerHTML = '';

    for (const character of arrayCharacters) {

        let statusTraducido;
        switch(character.status) {
            case 'Alive':
                statusTraducido = 'Vivo';
                break;
            case 'Dead':
                statusTraducido = 'Muerto';
                break;
            case 'unknown':
                statusTraducido = 'Desconocido';
                break;
        }

        let generoTraducido;
        switch(character.gender) {
            case 'Female':
                generoTraducido = 'Mujer';
                break;
            case 'Male':
                generoTraducido = 'Hombre';
                break;
            case 'unknown':
                generoTraducido = 'Desconocido';
                break;
        }

        let especieTraducido;
        switch(character.species) {
            case 'Human':
                especieTraducido = 'Humano';
                break;
            case 'unknown':
                especieTraducido = 'Desconocido';
                break;
            case 'Alien':
                especieTraducido = 'Extraterrestre';
                break;
            default:
                especieTraducido = character.species;
        }

        console.log(character.status);
        $containerCharacters.innerHTML += `
        <a id="link-character" href="https://google.com" class="block w-[30%] mb-5">
          <div class="bg-white border p-4 rounded-2xl shadow-lg hover:shadow-cyan-600 transition duration-300 ease-in-out hover:scale-105">
            <img class="mx-auto rounded-lg mb-4" src="${character.image}" alt="${character.name}" />
            <h2 class="text-xl font-semibold text-gray-800 mb-1">Nombre: <span class="text-cyan-600">${character.name}</span></h2>
            <h3 class="text-gray-600 mb-1">Status: <span class="font-medium">${statusTraducido}</span></h3>
            <h3 class="text-gray-600 mb-1">Género: <span class="font-medium">${generoTraducido}</span></h3>
            <h3 class="text-gray-600">Especie: <span class="font-medium">${especieTraducido}</span></h3>
          </div>
        </a>
      `;

    }
}

// -------------------------------------------------------- PINTAR EPISODIOS --------------------------------------------------------

const pintarEpisodios = (arrayEpisodes) => {
    $containerEpisodes.innerHTML = '';

    for (const episode of arrayEpisodes) {
        $containerEpisodes.innerHTML += `
        <a id="link-episode" href="https://google.com" class="block w-[20%] mb-5">
          <div class="flex flex-col justify-center w-full h-[200px] overflow-hidden bg-white border p-4 rounded-2xl shadow-lg hover:shadow-cyan-600 transition duration-300 ease-in-out hover:scale-105">
            <h2 class="text-xl font-semibold text-gray-800 mb-1">Nombre: <span class="text-cyan-600">${episode.name}</span></h2>
            <h3 class="text-gray-600 mb-1">Estreno: <span class="font-medium">${episode.air_date}</span></h3>
          </div>
        </a>
        `

    }
}

// -------------------------------------------------------- OBTENER DATA --------------------------------------------------------

const obtenerDatos = async (tipo = 'character', pagina = 1, nombre = '') => {
    try {
        mostrarElemento([$('#loader')]);
        page = pagina;
        const { data } = await axios(`https://rickandmortyapi.com/api/${tipo}/?page=${page}&name=${nombre}`);
        const resultados = data.results;
        let totalPages = data.info.pages;
        let number = data.info.count;

        if (tipo === 'character') {
            pintarPersonajes(resultados);
        } else if (tipo === 'episode') {
            pintarEpisodios(resultados);
        }

        renderizarPaginacion(page, totalPages, tipo, nombre);
        actualizarResultados(number);
    } catch (error) {
        console.log(error);
    } finally {
        ocultarElemento([$('#loader')]);
    }
};


// -------------------------------------------------------- SELECT EPISODIOS / PERSONAJES --------------------------------------------------------

$selectTipo.addEventListener('input', (elem) => {
    const tipo = elem.target.value;
    if (tipo === 'character') {
        mostrarElemento([$containerCharacters]);
        ocultarElemento([$containerEpisodes]);
    } else if (tipo === 'episode') {
        ocultarElemento([$containerCharacters]);
        mostrarElemento([$containerEpisodes]);
    }
    obtenerDatos(tipo);
});


// -------------------------------------------------------- PAGINACION CAMBIO DE PAGINA -------------------------------------------------------- 

const renderizarPaginacion = (paginaActual, totalPaginas, tipo, nombre) => {
    $pagination.innerHTML = '';

    const crearBoton = (texto, habilitado, onClick) => {
        const btn = document.createElement('li');
        btn.className = `btn list-none leading-[45px] text-[18px] text-center font-semibold px-3 ${habilitado ? 'hover:bg-cyan-600 hover:text-white cursor-pointer' : 'disabled cursor-default text-gray-400'}`;
        btn.innerHTML = `<span>${texto}</span>`;
        if (habilitado) {
            btn.addEventListener('click', onClick);
        }
        return btn;
    };

    const btnPrev = crearBoton('<i class="bi bi-arrow-left"></i>Volver', paginaActual > 1, () => {
        obtenerDatos(tipo, paginaActual - 1, nombre);
    });
    $pagination.appendChild(btnPrev);
    btnPrev.classList.add('prev');

    const maxBotones = 5;
    let inicio = Math.max(1, paginaActual - 2);
    let fin = Math.min(totalPaginas, inicio + maxBotones - 1);

    if (fin - inicio < maxBotones - 1) {
        inicio = Math.max(1, fin - maxBotones + 1);
    }

    for (let i = inicio; i <= fin; i++) {
        const btnPage = document.createElement('li');
        btnPage.className = `number list-none leading-[45px] text-center h-[45px] w-[45px] text-[18px] cursor-pointer font-semibold mx-1 ${paginaActual === i ? 'bg-cyan-600 text-white rounded-full' : 'hover:bg-cyan-600 hover:text-white hover:rounded-full'}`;
        btnPage.innerHTML = `<span>${i}</span>`;
        btnPage.addEventListener('click', () => {
            obtenerDatos(tipo, i, nombre);
        });
        $pagination.appendChild(btnPage);
    }

    const btnNext = crearBoton('Siguiente<i class="bi bi-arrow-right"></i>', paginaActual < totalPaginas, () => {
        obtenerDatos(tipo, paginaActual + 1, nombre);
    });
    $pagination.appendChild(btnNext);
    btnNext.classList.add('next');
};

// Results 

const actualizarResultados = (number) => {
    $resultsNumber.innerHTML = '';
    $resultsNumber.innerHTML += `${number}`;
}

// Buscar por personaje y episodio

$btnBuscar.addEventListener('click', () => {
    const nombre = $inputBuscar.value.trim();
    const tipo = $selectTipo.value;
    obtenerDatos(tipo, 1, nombre);
});







// -------------------------------------------------------- WINDOW.ONLOAD --------------------------------------------------------

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const parallax = document.getElementById('parallax-img');
    parallax.style.transform = `translateY(${scrollY * 0.3}px)`;
});

window.addEventListener('load', () => {
    obtenerDatos('character', page); 
    mostrarElemento([$containerCharacters]);
    ocultarElemento([$containerEpisodes]);
});

