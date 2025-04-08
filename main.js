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

// -------------------------------------------------------- PINTAR PERSONAJES --------------------------------------------------------

const pintarPersonajes = (arrayCharacters) => {
    $containerCharacters.innerHTML = '';

    for (const character of arrayCharacters) {
        $containerCharacters.innerHTML += `
        <a id="link-character" href="https://google.com" class="block w-[30%] mb-5">
          <div class="bg-white border p-4 rounded-2xl shadow-lg hover:shadow-cyan-600 transition duration-300 ease-in-out hover:scale-105">
            <img class="mx-auto rounded-lg mb-4" src="${character.image}" alt="${character.name}" />
            <h2 class="text-xl font-semibold text-gray-800 mb-1">Nombre: <span class="text-cyan-600">${character.name}</span></h2>
            <h3 class="text-gray-600 mb-1">Status: <span class="font-medium">${character.status}</span></h3>
            <h3 class="text-gray-600 mb-1">Género: <span class="font-medium">${character.gender}</span></h3>
            <h3 class="text-gray-600">Especie: <span class="font-medium">${character.species}</span></h3>
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

// -------------------------------------------------------- OBTENER PERSONAJES --------------------------------------------------------

const obtenerPersonajes = async (pagina = 1, nombre = '') => {
    try {
        page = pagina; 
        const { data } = await axios(`https://rickandmortyapi.com/api/character/?page=${page}`);
        const personajes = data.results;
        totalPages = data.info.pages;

        pintarPersonajes(personajes);
        renderizarPaginacion(page, totalPages);
    } catch (error) {
        console.log(error);
    }
};


// -------------------------------------------------------- OBTENER EPISODIOS --------------------------------------------------------

const obtenerEpisodios = async () => {
    try {
        const { data } = await axios('https://rickandmortyapi.com/api/episode')
        const episodios = data.results;
        pintarEpisodios(episodios)
    } catch (error) {
        console.log(error);
    }
}

// -------------------------------------------------------- SELECT EPISODIOS / PERSONAJES --------------------------------------------------------

$selectTipo.addEventListener('input', (elem) => {
    if (elem.target.value == 'character') {
        mostrarElemento([$containerCharacters]);
        ocultarElemento([$containerEpisodes]);
        obtenerPersonajes();
    } else if (elem.target.value == 'episode') {
        ocultarElemento([$containerCharacters]);
        mostrarElemento([$containerEpisodes]);
        obtenerEpisodios();
    }
})


// -------------------------------------------------------- PAGINACION CAMBIO DE PAGINA -------------------------------------------------------- 

const renderizarPaginacion = (paginaActual, totalPaginas) => {
    $pagination.innerHTML = ''; // Limpiamos el contenido anterior

    // Botón "Volver"
    const btnPrev = document.createElement('li');
    btnPrev.className = 'btn list-none leading-[45px] text-[18px] text-center cursor-pointer font-semibold px-3';
    btnPrev.innerHTML = `<span><i class="bi bi-arrow-left"></i>Volver</span>`;
    if (page === 1) {
        btnPrev.classList.add('disabled', 'cursor-default', 'text-gray-400');
        btnPrev.classList.remove('cursor-pointer');
    } else {
        btnPrev.classList.add('hover:bg-cyan-600', 'hover:text-white', 'cursor-pointer', 'prev');
        btnPrev.addEventListener('click', () => {
            if (page > 1) {
                page--;
                obtenerPersonajes(page);
            }
        });
    }
    $pagination.appendChild(btnPrev);

    // Botones de páginas (dinámico alrededor de la actual, máx 5)
    const maxBotones = 5;
    let inicio = Math.max(1, paginaActual - 2);
    let fin = Math.min(totalPaginas, inicio + maxBotones - 1);

    if (fin - inicio < maxBotones - 1) {
        inicio = Math.max(1, fin - maxBotones + 1);
    }

    for (let i = inicio; i <= fin; i++) {
        const btnPage = document.createElement('li');
        btnPage.className = `number list-none leading-[45px] text-center h-[45px] w-[45px] text-[18px] cursor-pointer font-semibold hover:bg-cyan-600 hover:text-white hover:rounded-full mx-1 ${paginaActual === i ? 'bg-cyan-600 text-white rounded-full' : ''}`;
        btnPage.innerHTML = `<span>${i}</span>`;
        btnPage.addEventListener('click', () => {
            page = i;
            obtenerPersonajes(i);
        });
        $pagination.appendChild(btnPage);
    }

    // Botón "Siguiente"
    const btnNext = document.createElement('li');
    btnNext.className = 'btn next list-none leading-[45px] text-[18px] text-center cursor-pointer font-semibold hover:bg-cyan-600 hover:text-white px-3';
    btnNext.innerHTML = `<span>Siguiente<i class="bi bi-arrow-right"></i></span>`;
    if( paginaActual === totalPages) {
        btnNext.classList.add('disabled', 'cursor-default', 'text-gray-400');
        btnNext.classList.remove('cursor-pointer')
    } else {
        btnNext.classList.add('hover:bg-cyan-600', 'hover:text-white', 'cursor-pointer', 'next');
        btnNext.addEventListener('click', () => {
            if (paginaActual < totalPaginas) {
                page++
                obtenerPersonajes(page);
            }
        });
    }
    
    $pagination.appendChild(btnNext);
};









// -------------------------------------------------------- WINDOW.ONLOAD --------------------------------------------------------

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const parallax = document.getElementById('parallax-img');
    parallax.style.transform = `translateY(${scrollY * 0.3}px)`;
});

window.addEventListener('load', () => {
    obtenerPersonajes(page); 
});

