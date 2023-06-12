// DOM elements
const moveSelect = document.getElementById('moveSelect');
const pokemonSelect = document.getElementById('pokemonSelect');
const playerHP = document.getElementById('playerHP');
const opponentHP = document.getElementById('opponentHP');
const battleLog = document.getElementById('battleLog');
const playerSprite = document.getElementById('playerSprite');
const opponentSprite = document.getElementById('opponentSprite');
const opponentPokemonRemaining = document.getElementById('opponentRemainingCount')
const newOpponentButton = document.getElementById('newOpponentButton');
const useMoveButton = document.getElementById('useMoveButton');
const switchPokemonButton = document.getElementById('switchPokemonButton');


// Event listners
useMoveButton.addEventListener('click', selectPlayerMove);
switchPokemonButton.addEventListener('click', switchPlayerPokemon);
newOpponentButton.addEventListener('click', fightNewOpponent);

// Global variables
let playerPokemon;
let playerPokemons = [];
let opponentPokemon;
let opponentPokemons = [];
let playerWallet = 500;
let playerWon = false;
const trainerNames = [
    "Ash",
    "Misty",
    "Brock",
    "Gary",
    "Serena",
    "Cynthia",
    "Steven",
    "Lance",
    "May",
    "Dawn"
];
const rewardAmounts = {
    1: 200,
    2: 500,
    3: 750,
    4: 1000,
    5: 1250,
    6: 1500
};


// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to fetch pokemons for the player using the API, also grabs the sprites
async function getPlayerPokemons() {
    playerPokemons = [];

    for (let i = 0; i < 6; i++) {
        const randomPokemonId = getRandomInt(1, 151);
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`);
        const result = await response.json();

        // Fetch the sprite 
        const spriteURL = result.sprites.front_default;
        const spriteResponse = await fetch(spriteURL);
        //Convert it to a Binary Large Object (blob)
        const spriteBlob = await spriteResponse.blob();
        // Create a File object for further processing
        const spriteFile = new File([spriteBlob], `${result.name}.png`, { type: spriteBlob.type });
        // Add the Pokémon object with the sprite file to the playerPokemons array
        playerPokemons.push({ ...result, spriteFile });
    }

    return playerPokemons;
}

// Function to fetch pokemons for the opponent using the API, also grabs the sprites
async function getOpponentPokemons() {
    opponentPokemons = [];

    const opponentCount = getRandomInt(1, 6);

    for (let i = 0; i < opponentCount; i++) {
        const randomPokemonId = getRandomInt(1, 151);
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`);
        const result = await response.json();

        // Fetch the sprite 
        const spriteURL = result.sprites.front_default;
        const spriteResponse = await fetch(spriteURL);
        //Convert it to a Binary Large Object (blob)
        const spriteBlob = await spriteResponse.blob();
        // Create a File object for further processing
        const spriteFile = new File([spriteBlob], `${result.name}.png`, { type: spriteBlob.type });
        // Add the Pokémon object with the sprite file to the opponentPokemons array
        opponentPokemons.push({ ...result, spriteFile });
    }

    return opponentPokemons;
}

// Function for getting a random trainer name
function randomTrainer() {
    const randomTrainerName = trainerNames[Math.floor(Math.random() * trainerNames.length)];
    return randomTrainerName;
}

// Function to fight a new opponent, requires that the last battle is finished 
function fightNewOpponent() {
    if (!playerWon) {
        // Player has not won the previous battle
        updateBattleLog('You need to win the previous battle to start a new one!');
        return;
    }

    // Clear the battle log and reset player and opponent HP
    battleLog.innerHTML = '';
    updatePlayerHP(playerPokemon.stats[0].base_stat);
    updateOpponentHP(0, 0);
    updateOpponentRemainingCount(0);

    // Reset playerWon to false for the new battle
    playerWon = false;

    // Get a random number between 1 and 6 for the number of opponentPokemons
    const opponentCount = getRandomInt(1, 6);

    // Get new opponentPokemons
    getOpponentPokemons(opponentCount).then((newOpponentPokemons) => {
        opponentPokemons = newOpponentPokemons;

        // Select the first available opponent Pokémon
        opponentPokemon = opponentPokemons.find((pokemon) => !isFainted(pokemon));

        // Update opponent sprite, name, HP, and remaining count
        updateOpponentSprite(opponentPokemon.sprites.front_default, opponentPokemon.name);
        updateOpponentHP(opponentPokemon.stats[0].base_stat, opponentPokemons.length);
        updateOpponentRemainingCount(opponentPokemons.length);

        // Update the log with the new opponent and trainer name
        updateBattleLog(`A new opponent appears: ${randomTrainer()}`);
    });
}

// Function to fetch move damage data
async function getMoveDamage(moveName) {
    const response = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`);
    const result = await response.json();
    return result.power;
}

// Function to populate the move scroll list
async function populateMoveOptions() {
    const moveSelect = document.getElementById('moveSelect');
    moveSelect.innerHTML = ''; // Clear the list before populating

    // Grabbing move names from playerPokemon.moves array
    const moveNames = playerPokemon.moves.map((move) => move.move.name);
    // Fetching move damages asynchronously using Promise.all and map
    const moveDamages = await Promise.all(moveNames.map(getMoveDamage));

    // Creating option elements for each move and appending them to moveSelect
    playerPokemon.moves.forEach((move, index) => {
        const option = document.createElement('option');
        // Setting option value to move name
        option.value = move.move.name;
        // Setting option text to move name and corresponding damage
        option.text = `${move.move.name} (${moveDamages[index]} damage)`;
        // Appending the option element to moveSelect
        moveSelect.appendChild(option);
    });

}

// Function to populate the pokemon scroll list
function populatePokemonOptions(pokemons) {
    const pokemonSelect = document.getElementById('pokemonSelect');
    pokemonSelect.innerHTML = ''; // Clear the list before populating

    // Creating option elements for each pokemon and appending them to pokemonSelect
    pokemons.forEach((pokemon, index) => {
        const option = document.createElement('option');
        // Setting option value to pokemon name
        option.value = index;
        // Seeting option text to pokemon name and appends (fainted) if it has fainted
        option.text = pokemon.name + (isFainted(pokemon) ? " (fainted)" : "");
        // Appending the option element to pokemonSelect
        pokemonSelect.appendChild(option);
    });
}

// Function to choose move
function selectPlayerMove() {
    const selectedMove = moveSelect.value;

    // Proceed with the turn using the selected move
    battleTurn(selectedMove);
}

// Function to switch pokemon
async function switchPokemon(selectedPokemonIndex) {
    // Get the new selected Pokémon from the playerPokemons array
    const newPokemon = playerPokemons[selectedPokemonIndex];

    // Update the playerPokemon variable with the new Pokémon
    playerPokemon = newPokemon;

    // Update the player's HP, sprite, and name
    updatePlayerHP(playerPokemon.stats[0].base_stat);
    updatePlayerSprite(playerPokemon.sprites.front_default, playerPokemon.name);

    // Clear the move options and repopulate them for the new Pokémon
    moveSelect.innerHTML = ''; // Clear the select element before repopulating
    populateMoveOptions(selectedPokemonIndex);

    // Update the log with the Pokémon switch
    updateBattleLog(`Player switches to ${playerPokemon.name}`);
}

// Function to switch the opponent pokemon when the current one faints or have the player win if all opponent pokemons have fainted
function switchOpponentPokemon() {
    // Filtering the opponentPokemons array to get the count of remaining unfainted Pokémon
    const remainingCount = opponentPokemons.filter(pokemon => !isFainted(pokemon)).length;
    // Updating the display of opponent's remaining Pokémon count
    updateOpponentRemainingCount(remainingCount);

    // Finding the index of the next unfainted Pokémon in the opponentPokemons array
    const nextPokemonIndex = opponentPokemons.findIndex(pokemon => !isFainted(pokemon));

    // Checking if there is a next unfainted Pokémon
    if (nextPokemonIndex !== -1) {
        // Assigning the next unfainted Pokémon to the opponentPokemon variable
        opponentPokemon = opponentPokemons[nextPokemonIndex];
        // Updating the opponent's HP display with the base stat from opponentPokemon
        updateOpponentHP(opponentPokemon.stats[0].base_stat, remainingCount);
        // Updating the opponent's sprite display with the front default sprite and name from opponentPokemon
        updateOpponentSprite(opponentPokemon.sprites.front_default, opponentPokemon.name);
        // Updating the battle log with the opponents switch message
        updateBattleLog(`Opponent switches to ${opponentPokemon.name}`);
    } else {
        // Getting the total count of opponentPokemons
        const opponentCount = opponentPokemons.length;
        // Retrieving the reward amount for winning the battle based on opponentCount
        const rewardAmount = rewardAmounts[opponentCount] || 0;
        // Increasing the players wallet by the reward amount
        playerWallet += rewardAmount;
        // Updating the battle log with the victory message and the received reward amount
        updateBattleLog(`Player won the battle! Received $${rewardAmount} as a reward!`);
        // Updating the players wallet display with the updated wallet balance
        updatePlayerWallet(playerWallet);
        // Setting the playerWon boolean to true to indicate the players victory
        playerWon = true;
    }
}


// Function to switch the players Pokémon based on the selected index from the Pokémon select element
function switchPlayerPokemon() {
    // Convert the value of pokemonSelect to a number 
    const selectedPokemonIndex = +pokemonSelect.value;
    // Call the switchPokemon function with the selectedPokemonIndex
    switchPokemon(selectedPokemonIndex);
}

// Function to update the players wallet display with the balance
function updatePlayerWallet(balance) {
    // Get the element with the ID 'playerWallet'
    const playerWalletElement = document.getElementById('playerWallet');
    // Set the text content of the playerWalletElement to a formatted string displaying the balance
    playerWalletElement.textContent = `Wallet: $${balance}`;
}


// Function to update the player's HP
function updatePlayerHP(hp) {
    playerHP.textContent = hp <= 0 ? 'HP: Fainted' : `HP: ${hp}`;
}

// Function to update the remaining Pokémon count
function updateOpponentRemainingCount(count) {
    opponentRemainingCount.textContent = count;
}

// Function to update the opponent's HP and remaining Pokémon count
function updateOpponentHP(hp, remainingCount) {
    opponentHP.textContent = hp <= 0 ? 'HP: Fainted' : `HP: ${hp}`;
}


// Function to update the battle log with a given message
function updateBattleLog(message) {
    // Create a new <p> element to represent a log entry
    const logEntry = document.createElement('p');
    // Set the text content of the log entry to the provided message
    logEntry.textContent = message;
    // Append the log entry to the battleLog container
    battleLog.appendChild(logEntry);
    // Scroll the battleLog element to the bottom to show the latest log entry
    battleLog.scrollTop = battleLog.scrollHeight;
}

// Function to update the players sprite and name display
function updatePlayerSprite(spriteURL, name, shake) {
    // Set the HTML content of the playerSprite element to display the players sprite and name
    playerSprite.innerHTML = `<img src="${spriteURL}" alt="Player Sprite">
                    <span class="pokemon-name">${name}</span>`;
    // Check if shake is true
    if (shake) {
        // Add the 'shake' CSS class to playerSprite to trigger the shaking animation
        playerSprite.classList.add('shake');
        // Set a timeout function to remove the 'shake' CSS class after 500 milliseconds
        setTimeout(() => {
            playerSprite.classList.remove('shake');
        }, 500);
    }
}

// Function to update the opponents sprite and name display
function updateOpponentSprite(spriteURL, name, shake) {
    // Set the HTML content of the opponentSprite element to display the opponents sprite and name
    opponentSprite.innerHTML = `<img src="${spriteURL}" alt="Opponent Sprite">
                      <span class="pokemon-name">${name}</span>`;
    // Check if shake is true
    if (shake) {
        // Add the 'shake' CSS class to opponentSprite to trigger the shaking animation
        opponentSprite.classList.add('shake');
        // Set a timeout function to remove the 'shake' CSS class after 500 milliseconds
        setTimeout(() => {
            opponentSprite.classList.remove('shake');
        }, 500);
    }
}

// Function to add a delay
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to randomly select a move for the opponents Pokémon
function selectMove(pokemon) {
    // Generate a random index within the range of available moves for the given Pokémon
    const randomMoveIndex = getRandomInt(0, pokemon.moves.length - 1);
    // Return the name of the move at the randomly selected index
    return pokemon.moves[randomMoveIndex].move.name;
}

// Function to check if a Pokémon is fainted
function isFainted(pokemon) {
    // Check if the base stat of the Pokémon's first stat entry is less than or equal to 0
    return pokemon.stats[0].base_stat <= 0;
}


// Function to execute a battle turn between the player and the opponent
async function battleTurn(playerMove) {

    // Check if the players Pokémon is fainted
    if (isFainted(playerPokemon)) {
        updateBattleLog('Player Pokémon fainted!');
        return;
    }

    // Check if the opponents Pokémon is fainted
    if (isFainted(opponentPokemon)) {
        updateBattleLog('Opponent Pokémon fainted!');
        switchOpponentPokemon();
        return;
    }

    // Select a move for the opponents Pokémon
    const opponentMove = selectMove(opponentPokemon);

    // Log the players move
    updateBattleLog(`Player uses ${playerMove}!`);

    // Get the damage of the players move
    const playerMoveDamage = await getMoveDamage(playerMove);
    // Reduce the opponents Pokémons health by the players move damage
    opponentPokemon.stats[0].base_stat -= playerMoveDamage;

    // Update the opponents HP display
    updateOpponentHP(opponentPokemon.stats[0].base_stat);
    // Trigger a sprite animation for the players Pokémon
    updatePlayerSprite(playerPokemon.sprites.front_default, playerPokemon.name, true);

    // Check if the opponents Pokémon is fainted after the players move
    if (isFainted(opponentPokemon)) {
        updateBattleLog('Opponent Pokémon fainted!');
        switchOpponentPokemon();
        return;
    }

    // Delay the battle for 1 second
    await delay(1000);

    // Get the damage of the opponents move
    const opponentMoveDamage = await getMoveDamage(opponentMove);
    // Reduce the players Pokémons health by the opponents move damage
    playerPokemon.stats[0].base_stat -= opponentMoveDamage;

    // Log the opponents move and its damage
    if (opponentMoveDamage === null) {
        updateBattleLog(`Opponent uses ${opponentMove}, it's a useless move!`);
    } else {
        updateBattleLog(`Opponent uses ${opponentMove}, it dealt ${opponentMoveDamage} damage to ${playerPokemon.name}!`);
    }

    // Update the players HP display
    updatePlayerHP(playerPokemon.stats[0].base_stat);
    // Trigger a sprite animation for the opponents Pokémon
    updateOpponentSprite(opponentPokemon.sprites.front_default, opponentPokemon.name, true);

    // Check if the players Pokémon is fainted after the opponents move
    if (isFainted(playerPokemon)) {
        updateBattleLog('Player Pokémon fainted!');
        return;
    }
}

// Function to start a battle
async function startBattle() {
    // Update the battle log with a message indicating a new opponent has appeared
    updateBattleLog(`A new opponent appears: ${randomTrainer()}`);

    // Retrieve the players Pokémon team
    const playerPokemons = await getPlayerPokemons();

    // Select a random Pokémon from the players team
    playerPokemon = playerPokemons[getRandomInt(0, playerPokemons.length - 1)];

    // Retrieve the opponents Pokémon team
    const opponentPokemons = await getOpponentPokemons();

    // Set the first opponents Pokémon as the current opponent
    opponentPokemon = opponentPokemons[0];

    // Update the opponents remaining count display
    opponentPokemonRemaining.textContent = opponentPokemons.length;

    // Update the players and opponents HP display
    updatePlayerHP(playerPokemon.stats[0].base_stat);
    updateOpponentHP(opponentPokemon.stats[0].base_stat);

    // Update the players and oppoenents sprite and name display
    updatePlayerSprite(playerPokemon.sprites.front_default, playerPokemon.name);
    updateOpponentSprite(opponentPokemon.sprites.front_default, opponentPokemon.name);

    // Populate the available Pokémon options for the player to switch
    populatePokemonOptions(playerPokemons);

    // Populate the available move options for the player to choose
    populateMoveOptions();
}

// Start the battle
startBattle();
