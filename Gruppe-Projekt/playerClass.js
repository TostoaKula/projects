import { starters } from "./datafetch.js";

export class Player {
    constructor() {
      this.hp = 100;
      this.dmg = 35;
    }
  
    gainHP(amount) {
      this.hp += amount;
    }
    dealdmg(damages) {
      this.dmg += damages;
    }
  }



