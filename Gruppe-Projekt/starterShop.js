       const url = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0.";
       
       
       
      class Starters {
        constructor(value, name, front) {
          this.value = value;
          this.name = name;
          this.front = front;
        }
      } 
      let pokemons = [];
      var front = document.createElement("img");
        //her fetcher vi dataen fra URLen og laver til et array
        for (let index = 0; index < arr.length; index++) {
          pokemons.push(new Starters(value, front))
          
        }
        
        
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
        
        //her laver vi en liste med starterne
        const list = document.getElementById("starters"); 
        //her kører den for hver gang   
        starters.forEach(function(starter) {

        var button = document.createElement("button");

        button.textContent = starter;

        list.appendChild(button);
        });
        }





        function shop(){
        
        }

        