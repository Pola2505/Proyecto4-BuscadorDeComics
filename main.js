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

const obtenerPersonajes = async () => {
    try {
        const { data } = await axios('https://rickandmortyapi.com/api/character')
        const personajes = data.results;
        pintarPersonajes(personajes);
    } catch (error) {
        console.log(error);
    }
}

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










// -------------------------------------------------------- WINDOW.ONLOAD --------------------------------------------------------

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const parallax = document.getElementById('parallax-img');
    parallax.style.transform = `translateY(${scrollY * 0.3}px)`;

    obtenerPersonajes();
});