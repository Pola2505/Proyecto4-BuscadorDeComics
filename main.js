

const $ = (elem) => document.querySelector(elem);
const $$ = (elem) => document.querySelectorAll(elem);

// Atrapando los elementos delm DOM

const $containerCharacters = $('#container-characters');

const pintarDatos = (arrayCharacters) => {
    $containerCharacters.innerHTML = '';
  
    for (const character of arrayCharacters) {
      $containerCharacters.innerHTML += `
        <div class="w-[30%] bg-white border p-4 rounded-2xl shadow-lg hover:shadow-cyan-600 transition duration-300 ease-in-out hover:scale-105 mb-5">
          <img class="mx-auto rounded-lg mb-4" src="${character.image}" alt="${character.name}" />
          <h2 class="text-xl font-semibold text-gray-800 mb-1">Nombre: <span class="text-cyan-600">${character.name}</span></h2>
          <h3 class="text-gray-600 mb-1">Status: <span class="font-medium">${character.status}</span></h3>
          <h3 class="text-gray-600 mb-1">Género: <span class="font-medium">${character.gender}</span></h3>
          <h3 class="text-gray-600">Especie: <span class="font-medium">${character.species}</span></h3>
        </div>
      `;
    }
  }
  



const obtenerPersonajes = async () => {
    try {
       const {data} = await axios('https://rickandmortyapi.com/api/character') 
       const personajes = data.results;
       pintarDatos(personajes);
    } catch (error) {
        console.log(error);
    }
}





window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const parallax = document.getElementById('parallax-img');
    parallax.style.transform = `translateY(${scrollY * 0.3}px)`; 

    obtenerPersonajes();
  });