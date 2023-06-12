const url = "https://pokeapi.co/api/v2/pokemon?limit=1281&offset=0.";
let result = "";
let starters = [];
let svar = "";

function gamestart() {
  getinfo();
}

//her fetcher vi dataen fra URLen og laver til et array
async function getinfo() {
  const response = await fetch(url);
  result = await response.json();
  console.log(result);
  getStarters();
  getStats();
  makeButtons();
}

async function getStats() {
  for (let i = 0; i < starters.length; i++) {
    const got = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${starters[i]}/`
    );
    svar = await got.json();
    console.log(svar);
  }
}

async function makeButtons() {
  //her laver vi en liste med starterne
  const list = document.getElementById("starters");
  //her kører den for hver gang
  starters.forEach(function (starter) {
    var button = document.createElement("button");

    button.textContent = starter;

    list.appendChild(button);
  });
}

async function getStarters() {
  //her henter vi vores startere ud fra arrayet
  starters = [
    result.results[0].name,
    result.results[3].name,
    result.results[6].name,
    result.results[151].name,
    result.results[154].name,
    result.results[157].name,
  ];
}
gamestart();
