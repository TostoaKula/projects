  const url = "https://pokeapi.co/api/v2/pokemon?limit=1281&offset=0.";

  class Pokemon {
    constructor(name) {
      this.name = name;
      // Constructor der er lavet til at holde styr på pokemons
    }
  }
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
      result.results[157].name,
    ];

    const list = document.getElementById("starters");
    const button = document.getElementById("starters-button");
    
    starters.forEach(function (starter) {
      var button = document.createElement("button");
      button.textContent = starter;
      button.classList.add("starter-button");

      // Add event listener til at håndtere klik på knappen
      button.addEventListener("click", function () {
        transferToClass(starter);
        
      });

      list.appendChild(button);
    });
    button.style.display = "none";

    function transferToClass(pokemon) {
      // Her putter vi pokemonsne ind i deres class
      const pokemonObj = new Pokemon(pokemon);

      console.log("Transferring " + pokemonObj.name + " to your inventory");
      console.log(new Pokemon(pokemon))

      localStorage.setItem("pokemonName", pokemonObj.name);

      const gameUrl = "/Gruppe-Projekt/game.html?pokemon=" + pokemonObj.name;
      window.location.href = gameUrl;
    }
  }


        