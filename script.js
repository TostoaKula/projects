function getPokeman(){
const id= "pikachu"
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)

    .then((resp) => resp.json())
    .then((data) => console.log(data));
    
}

function fetchPokemons(number) {
    for (let i = 6; i <= number; i++) {
        fetchPokemons(i);
        
    }
}
getPokeman();
fetchPokemons();
