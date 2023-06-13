        
        // Her tager vi pokemonen ud fra localStorage
        const pokemonName = localStorage.getItem("pokemonName");
            console.log("Pokemon name: " + pokemonName);

        // Her laver vi et nyt array og putter tingene i  
        const pokemonArray = [];
        const clickedPokemonArray = [];
        // Tilføjer pokemonen til arrayet
        if (pokemonName) {
          clickedPokemonArray.push(pokemonName);
        }

        // Opdatere inventory og fremviser din pokemon
        const inventory = document.getElementById("inventory");
            if (inventory) {
              inventory.textContent = pokemonArray.join(", ");
            }

        // Her samler vi det nye array udfra local storage
            localStorage.setItem("pokemonArray", JSON.stringify(pokemonArray));
            console.log(pokemonName)
        // Funktionen der kører den klikkede pokemon så den bliver tilføjet til arrayet
            function transferToClass(clickedPokemon) {
              console.log("Transfer to inventory", clickedPokemon);
              clickedPokemonArray.push(clickedPokemon);
              console.log(clickedPokemonArray);
            }
        // den async funktion der kører for at hente alle pokemon    
            async function getPokemons() {
                const response = await fetch(url);
                const result = await response.json();
                console.log(result);
                
                const list = document.getElementById("buyPokemon");
        // det forloop der kører resultatet af arraye of pusher ude samtidig med at laver knapper    
            for (let i = 0; i < result.results.length; i++) {
                const pokemon = result.results[i].name;
        //Knapper der bliver lavet alt efter om de er i arrayet eller ej        
                if (pokemon !== pokemonName) {
                var button = document.createElement("button");
                button.textContent = pokemon;
                button.classList.add("buyPokemon-button");
        //Knappen der holder styr på hvilken pokemon der er blevet trykket på og kører så funktionen til at transfer dem    
                
                button.addEventListener("click", function () {
                    const clickedPokemon = this.textContent;
                    transferToClass(clickedPokemon);
                });

                list.appendChild(button);
                }
            }
        }

     getPokemons();