const res = require("express/lib/response");

const poke_container =
document.getElementById('poke_container');
const pokemons_number = 150;

const fetchPokemons = async() => {
    for(let i=1; i<= pokemons_number; i++){
        await getPokemon(i);
    }
}

const getPokemon = async id => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const pokemon = await res.json();
    console.log(pokemon);
}

getPokemon(1);