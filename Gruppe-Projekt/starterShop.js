       const url = "https://pokeapi.co/api/v2/pokemon";
        
        //her fetcher vi dataen fra URLen og laver til et array
        async function getStarters() {
        const response = await fetch(url);
        const result = await response.json();
        console.log(result);
        
        //her henter vi vores startere ud fra arrayet
        const starters = [
        result.results[0].name,
        result.results[3].name,
        result.results[6].name
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

        