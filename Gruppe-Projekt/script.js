/* function getPokeman(){
    const id= "pikachu"
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    
    .then((resp) => resp.json())
    .then((data) => console.log(data));
    
}
function GetAll (){
fetch(`https://pokeapi.co/api/v2/pokemon/?limit=811/`)
    .then((resp) => resp.json())
    .then((name) => console.log(name))
    console.log (name.result)}

    function fetchPokemons(number) {
    for (let i = 6; i <= number; i++) {
        fetchPokemons(i);
        
    }
}
GetAll();*/

const url = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0.";
        
        //her fetcher vi dataen fra URLen og laver til et array
        async function getStarters() {
        const response = await fetch(url);
        const result = await response.json();
        console.log(result);
        
        //her henter vi vores startere ud fra arrayet
        const starters = [
        result.results[0].name,
        result.results[3].name,
        result.results[6].name,
        result.results[151].name,
        result.results[154].name,
        result.results[157].name
        ];
        
        //her laver vi en liste med starterne
        const list = document.getElementById("starters"); 
        //her kører den for hver gang   
        starters.forEach(function(starter) {

        var button = document.createElement("button");

        button.textContent = starter;

        list.appendChild(button);
        });
        }