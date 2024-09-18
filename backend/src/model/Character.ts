import { v4 as uuidv4 } from "uuid";

export class Character {
  public id: string;
  public health: number;
  public attack: number;
  public defense: number;
  public movement: number;
  public canCrossWater: boolean;

  constructor(
    id: string,
    health: number,
    attack: number,
    defense: number,
    movement: number,
    canCrossWater: boolean
  ) {
    this.id = id;
    this.health = health;
    this.attack = attack;
    this.defense = defense;
    this.movement = movement;
    this.canCrossWater = canCrossWater;
  }

  public serialize(): object {
    return {
      id: this.id,
      health: this.health,
      attack: this.attack,
      defense: this.defense,
      movement: this.movement,
      canCrossWater: this.canCrossWater,
    };
  }
}

export class Warrior extends Character {
  constructor() {
    super(uuidv4(), 100, 20, 15, 2, false);
  }
}

export class Archer extends Character {
  constructor() {
    super(uuidv4(), 70, 25, 10, 2, false);
  }
}

export class Pikeman extends Character {
  constructor() {
    super(uuidv4(), 85, 18, 20, 2, false);
  }
}

export class Mage extends Character {
  constructor() {
    super(uuidv4(), 60, 30, 8, 2, true);
  }
}

export class Scout extends Character {
  constructor() {
    super(uuidv4(), 65, 15, 10, 3, false);
  }
}
