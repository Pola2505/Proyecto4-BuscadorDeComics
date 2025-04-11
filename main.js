// -------------------------------------------------------- VARIABLES --------------------------------------------------------

let page = 1;
let estadoActual = {
    tipo: 'character',
    nombre: '',
    status: '',
    gender: ''
};

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
const $selectGenero = $('#genero');
const $selectStatus = $('#status');
const $containerEpisodes = $('#container-episodes');
const $resultsNumber = $('#results-number');
const $btnBuscar = $('#btn-buscar');
const $inputBuscar = $('#input-buscar');
const $loader = $('#loader');
const $filterStatus = $('#filter-status');
const $filterGender = $('#filter-gender');


const $sectionResults = $('#section-results');
const $containerDetails = $('#container-details');
const $containerCharactersEpisodes = $('#container-characters-episodes');

// -------------------------------------------------------- PINTAR PERSONAJES --------------------------------------------------------

const pintarPersonajes = (arrayCharacters) => {
    $containerCharacters.innerHTML = '';

    for (const character of arrayCharacters) {

        let statusTraducido;
        switch (character.status) {
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
        switch (character.gender) {
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
        switch (character.species) {
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
        $containerCharacters.innerHTML += `
        <button id="${character.id}" class="btn-character block w-full md:w-[40%] lg:w-[30%] mb-5">
          <div class="bg-white border p-4 rounded-2xl shadow-lg hover:shadow-cyan-600 transition duration-300 ease-in-out hover:scale-105">
            <img class="mx-auto rounded-lg mb-4" src="${character.image}" alt="${character.name}" />
            <h2 class="text-xl font-semibold text-gray-800 mb-1">Nombre: <span class="text-cyan-600">${character.name}</span></h2>
            <h3 class="text-gray-600 mb-1">Status: <span class="font-medium">${statusTraducido}</span></h3>
            <h3 class="text-gray-600 mb-1">Género: <span class="font-medium">${generoTraducido}</span></h3>
            <h3 class="text-gray-600">Especie: <span class="font-medium">${especieTraducido}</span></h3>
          </div>
        </button>
      `;

    }
    detallesPersonaje();
}

// -------------------------------------------------------- PINTAR EPISODIOS --------------------------------------------------------

const pintarEpisodios = (arrayEpisodes) => {
    $containerEpisodes.innerHTML = '';

    for (const episode of arrayEpisodes) {
        $containerEpisodes.innerHTML += `
        <button id="${episode.id}" class="btn-episode block w-full md:w-[40%] lg:w-[25%] mb-5">
          <div class="flex flex-col justify-center w-full h-[200px] overflow-hidden bg-white border p-4 rounded-2xl shadow-lg hover:shadow-cyan-600 transition duration-300 ease-in-out hover:scale-105">
            <h2 class="text-xl font-semibold text-gray-800 mb-1">Nombre: <span class="text-cyan-600">${episode.name}</span></h2>
             <h3 class="text-gray-600 mb-1">Episodio: <span class="font-medium">${episode.episode}</span></h3>
            <h3 class="text-gray-600 mb-1">Estreno: <span class="font-medium">${episode.air_date}</span></h3>
          </div>
        </button>
        `;

    }

    detallesEpisodio();
}

// -------------------------------------------------------- OBTENER DATA --------------------------------------------------------

const obtenerDatos = async (tipo = 'character', pagina = 1, nombre = '', status = '', gender = '') => {
    try {
        mostrarElemento([$('#loader')]);
        page = pagina;
        const { data } = await axios(`https://rickandmortyapi.com/api/${tipo}/?page=${page}&name=${nombre}&status=${status}&gender=${gender}`);
        const resultados = data.results;
        let totalPages = data.info.pages;
        let number = data.info.count;


        if (tipo === 'character') {
            pintarPersonajes(resultados);
        } else if (tipo === 'episode') {
            pintarEpisodios(resultados);
        }

        renderizarPaginacion(page, totalPages, tipo, nombre, gender);
        actualizarResultados(number);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            if (tipo === 'character') {
                $containerCharacters.innerHTML = `
                <div class="flex flex-col justify-center items-center w-full">
                    <p class="text-gray-400 pb-5">No se encontro el personaje :-(</p>
                    <img class="rounded-full w-1/2" src="https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F255667fe-dfa8-4665-864a-6422344fc81f_1200x675.jpeg">
                </div>
                `;
                ocultarElemento([$containerEpisodes]);
                mostrarElemento([$containerCharacters]);
            } else {
                $containerEpisodes.innerHTML = `
                <div class="flex flex-col justify-center items-center w-full">
                    <p class="text-gray-400 pb-5">No se encontro el episodio :-(</p>
                    <img class="rounded-full w-1/2" src="https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F255667fe-dfa8-4665-864a-6422344fc81f_1200x675.jpeg">
                </div>
                `;
                ocultarElemento([$containerCharacters]);
                mostrarElemento([$containerEpisodes]);
            }

            renderizarPaginacion(1, 1, tipo, nombre, gender);
            actualizarResultados(0);

        } else {
            $containerEpisodes.innerHTML = `
                <div class="flex flex-col justify-center items-center w-full">
                    <p class="text-gray-400 pb-5">Hubo un problema :-(</p>
                    <img class="rounded-full w-1/2" src="https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F255667fe-dfa8-4665-864a-6422344fc81f_1200x675.jpeg">
                </div>
                `;
                ocultarElemento([$containerCharacters]);
                mostrarElemento([$containerEpisodes]);
        }
    } finally {
        ocultarElemento([$('#loader')]);
    }
};


// -------------------------------------------------------- SELECT EPISODIOS / PERSONAJES --------------------------------------------------------

$selectStatus.addEventListener('input', (elem) => {
    let status = elem.target.value;
    estadoActual.status = (status === 'todos') ? '' : status;
});

$selectGenero.addEventListener('input', (elem) => {
    let gender = elem.target.value;
    estadoActual.gender = (gender === 'todos') ? '' : gender;
});

$selectTipo.addEventListener('input', (elem) => {
    const tipo = elem.target.value;
    estadoActual.tipo = tipo;

    if (tipo === 'character') {
        mostrarElemento([$containerCharacters, $filterGender, $filterStatus]);
        ocultarElemento([$containerEpisodes]);
        $sectionResults.scrollIntoView({ behavior: 'smooth' });
    } else if (tipo === 'episode') {
        ocultarElemento([$containerCharacters, $filterGender, $filterStatus]);
        mostrarElemento([$containerEpisodes]);
        $sectionResults.scrollIntoView({ behavior: 'smooth' });
    }
});




// -------------------------------------------------------- PAGINACION CAMBIO DE PAGINA -------------------------------------------------------- 

const renderizarPaginacion = (paginaActual, totalPaginas, tipo, nombre, status = '', gender = '') => {
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
        obtenerDatos(tipo, paginaActual - 1, nombre, status, gender);
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
        btnPage.className = `number list-none leading-[45px] text-center h-[45px] w-[45px] text-[18px] cursor-pointer font-semibold mx-1 ${paginaActual === i ? 'bg-cyan-600 text-white rounded-full' : 'hover:bg-cyan-600 hover:text-white hover:rounded-full'} hidden md:inline`;
        btnPage.innerHTML = `<span>${i}</span>`;
        btnPage.addEventListener('click', () => {
            obtenerDatos(tipo, i, nombre, status, gender);
        });
        $pagination.appendChild(btnPage);
    }

    const btnNext = crearBoton('Siguiente<i class="bi bi-arrow-right"></i>', paginaActual < totalPaginas, () => {
        obtenerDatos(tipo, paginaActual + 1, nombre, status, gender);
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
    estadoActual.nombre = $inputBuscar.value.trim();


    const statusSeleccionado = $selectStatus.value;
    const genderSeleccionado = $selectGenero.value;

    estadoActual.status = (statusSeleccionado === 'todos') ? '' : statusSeleccionado;
    estadoActual.gender = (genderSeleccionado === 'todos') ? '' : genderSeleccionado;

    obtenerDatos(
        estadoActual.tipo,
        1,
        estadoActual.nombre,
        estadoActual.status,
        estadoActual.gender
    );
});


const mostrarDetallePersonaje = async (id) => {
    try {
        mostrarElemento([$loader]);
        const { data: personaje } = await axios(`https://rickandmortyapi.com/api/character/${id}`);
        const arrayPromises = personaje.episode.map((elem) => axios(elem));

        const response = await Promise.all(arrayPromises);

        const arrayDetailCharacter = response.map((elem) => elem.data);


        $containerCharactersEpisodes.innerHTML = '';

        for (const episode of arrayDetailCharacter) {
            $containerCharactersEpisodes.innerHTML += `
            <button id="${episode.id}" class="btn-episode-inside block w-[20%] mb-5">
                <div class="flex flex-col justify-center w-full h-[200px] overflow-hidden bg-white border p-4 rounded-2xl shadow-lg hover:shadow-cyan-600 transition duration-300 ease-in-out hover:scale-105">
            <h2 class="text-xl font-semibold text-gray-800 mb-1">Nombre: <span class="text-cyan-600">${episode.name}</span></h2>
             <h3 class="text-gray-600 mb-1">Episodio: <span class="font-medium">${episode.episode}</span></h3>
            <h3 class="text-gray-600 mb-1">Estreno: <span class="font-medium">${episode.air_date}</span></h3>
          </div>
          </button>
          
            `
        }

        activarClickEnItemsInternos()

        let statusTraducido = {
            Alive: 'Vivo',
            Dead: 'Muerto',
            unknown: 'Desconocido'
        }[personaje.status];

        let generoTraducido = {
            Female: 'Mujer',
            Male: 'Hombre',
            unknown: 'Desconocido'
        }[personaje.gender];

        let especieTraducido = {
            Human: 'Humano',
            Alien: 'Extraterrestre',
            unknown: 'Desconocido'
        }[personaje.species] || personaje.species;

        $containerDetails.innerHTML = `
            <div class="bg-white border p-6 rounded-2xl shadow-xl text-center max-w-xl mx-auto">
                <img class="rounded-lg mx-auto mb-4" src="${personaje.image}" alt="${personaje.name}" />
                <h2 class="text-2xl font-bold mb-2">${personaje.name}</h2>
                <p class="mb-1">Status: <span class="font-medium">${statusTraducido}</span></p>
                <p class="mb-1">Género: <span class="font-medium">${generoTraducido}</span></p>
                <p class="mb-1">Especie: <span class="font-medium">${especieTraducido}</span></p>
                <p class="mb-1">Origen: <span class="font-medium">${personaje.origin.name}</span></p>
                <p class="mb-1">Ubicación: <span class="font-medium">${personaje.location.name}</span></p>

                <button id="btn-volver" class="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">Volver</button>
            </div>
        `;


        ocultarElemento([
            $containerCharacters,
            $pagination,
            $filterStatus,
            $filterGender,
            $resultsNumber,
            $containerEpisodes
        ]);
        mostrarElemento([$containerCharactersEpisodes, $containerDetails]);
        $sectionResults.scrollIntoView({ behavior: 'smooth' });


        $('#btn-volver').addEventListener('click', () => {
            mostrarElemento([
                $containerCharacters,
                $pagination,
                $filterStatus,
                $filterGender,
                $resultsNumber
            ]);
            ocultarElemento([$containerCharactersEpisodes, $containerDetails]);

            obtenerDatos(
                estadoActual.tipo,
                page,
                estadoActual.nombre,
                estadoActual.status,
                estadoActual.gender
            );
        });

    } catch (error) {
        console.log('Error al mostrar detalle del personaje', error);
    } finally {
        ocultarElemento([$loader]);
    }
};

const detallesPersonaje = () => {
    const $$btnCharacter = $$('.btn-character');
    $$btnCharacter.forEach((boton) => {
        boton.addEventListener('click', (e) => {
            const idCharacter = e.currentTarget.id;
            mostrarDetallePersonaje(idCharacter);
        });
    });
};

const detallesEpisodio = () => {
    const $$btnEpisode = $$('.btn-episode');
    $$btnEpisode.forEach((boton) => {
        boton.addEventListener('click', (e) => {
            const idEpisode = e.currentTarget.id;
            mostrarDetalleEpisodio(idEpisode);
        })
    })
}

const mostrarDetalleEpisodio = async (id) => {
    try {
        mostrarElemento([$loader]);
        const { data: episode } = await axios(`https://rickandmortyapi.com/api/episode/${id}`);
        const arrayPromises = episode.characters.map((elem) => axios(elem));

        const response = await Promise.all(arrayPromises);

        const arrayDetailEpisode = response.map((elem) => elem.data);

        $containerCharactersEpisodes.innerHTML = '';

        for (const character of arrayDetailEpisode) {
            $containerCharactersEpisodes.innerHTML += `
            <button id="${character.id}" class="btn-character-inside block w-[30%] mb-5">
        <div class="bg-white border p-6 rounded-2xl shadow-xl text-center w-[250px]">
            <img class="rounded-lg mx-auto mb-4" src="${character.image}" alt="${character.name}" />
            <h2 class="text-xl font-bold mb-2">${character.name}</h2>
        </div>
        </button>
    `;
        }

        activarClickEnItemsInternos()


        $containerDetails.innerHTML = `
        <div class="flex flex-col justify-center items-center mt-4 w-full min-h-[200px] overflow-hidden bg-white border p-4 rounded-2xl shadow-lg hover:shadow-cyan-600 transition duration-300 ease-in-out hover:scale-105">

            <img src="https://m.media-amazon.com/images/M/MV5BOGEyOTJkNDEtZGZiNi00NWJjLWEyZTEtYTRiYTMxMDA2Mzk3XkEyXkFqcGc@._V1_.jpg" class="w-[250px] h-[180px] mt-10">
            <h2 class="text-xl font-semibold text-gray-800 mb-1">Nombre: <span class="text-cyan-600">${episode.name}</span></h2>
            <h3 class="text-gray-600 mb-1">Estreno: <span class="font-medium">${episode.air_date}</span></h3>
            <h3 class="text-gray-600 mb-1">Episodio: <span class="font-medium">${episode.episode}</span></h3>
            <button id="btn-volver" class="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">Volver</button>
        </div> `;

        ocultarElemento([
            $containerCharacters,
            $pagination,
            $filterStatus,
            $filterGender,
            $resultsNumber,
            $containerEpisodes
        ]);
        mostrarElemento([$containerDetails, $containerCharactersEpisodes]);
        $sectionResults.scrollIntoView({ behavior: 'smooth' });

        $('#btn-volver').addEventListener('click', () => {
            mostrarElemento([
                $containerEpisodes,
                $pagination,
                $filterStatus,
                $filterGender,
                $resultsNumber
            ]);
            ocultarElemento([$containerDetails, $containerCharactersEpisodes]);

            obtenerDatos(
                estadoActual.tipo,
                page,
                estadoActual.nombre,
                estadoActual.status,
                estadoActual.gender
            );
        });


    } catch (error) {
        console.log(error);
    } finally {
        ocultarElemento([$loader]);
    }
}

const activarClickEnItemsInternos = () => {
    // Episodios dentro de un personaje
    const $$episodiosInternos = $$('.btn-episode-inside');
    $$episodiosInternos.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.id;
            mostrarDetalleEpisodio(id);
        });
    });

    // Personajes dentro de un episodio
    const $$personajesInternos = $$('.btn-character-inside');
    $$personajesInternos.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.id;
            mostrarDetallePersonaje(id);
        });
    });
};


// -------------------------------------------------------- WINDOW.ONLOAD --------------------------------------------------------

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const parallax = document.getElementById('parallax-img');
    parallax.style.transform = `translateY(${scrollY * 0.3}px)`;
});

window.addEventListener('load', () => {
    obtenerDatos('character', page);
    mostrarElemento([$containerCharacters]); // ocultando por ahora para crear el modal
    ocultarElemento([$containerEpisodes]);
});

