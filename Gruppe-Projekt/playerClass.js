import { starters } from "./datafetch.js";

export class Player {
    constructor(name,hp) {
       this.name=name;
       this.hp = hp;
     
    }
  
    gainHP(amount) {
      this.hp += amount;
    }
    dealdmg(damages) {
      this.dmg += damages;
    }
  }



