
export class healingItem {
  constructor(name, hpRecovery) {
    this.name = name;
    this.hpRecovery = hpRecovery;
  }

  use(player) {
    player.gainHP(this.hpRecovery);
  }
}

export class buffItem {
  constructor(id, dmg) {
    this.id = id;
    this.dmg = dmg;
  }

  use(player) {
    player.dealdmg(this.dmg);
  }
}


