import { healingItem } from "./itemClass.js";
import { buffItem } from "./itemClass.js";
import { Player } from "./playerClass.js";
import { svar } from "./datafetch.js";
import { result } from "./datafetch.js";

const healthportion = new healingItem("Healing Potion", 10);
const healthportion2 = new healingItem("Elixir of health", 20);
const handofgod = new buffItem("SpikeGlove", 5);

const player = new Player(100, 35);

console.log("hp", player.hp);
console.log("dmg", player.name);

healthportion.use(player);
handofgod.use(player);

console.log("item hp", player.hp);
console.log("name", player.name);

export async function createpokemons() {
  const pokestarters = new Player(
    result.results[0].name,
    svar.stats[0].base_stat
  );
  console.log(pokestarters);
  healthportion.use(pokestarters);
  console.log(pokestarters);
}
