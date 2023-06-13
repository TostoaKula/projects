import {healingItem} from './itemClass.js';
import {buffItem} from './itemClass.js';
import {Player} from './playerClass.js';

const healthportion = new healingItem("Healing Potion", 10);
const healthportion2 = new healingItem("Elixir of health", 20);
const handofgod = new buffItem("SpikeGlove", 5);


const player = new Player(100,35);


console.log("hp", player.hp);
console.log("dmg", player.dmg);


healthportion.use(player);
handofgod.use(player);


console.log("item hp", player.hp);
console.log("item dmg", player.dmg);
