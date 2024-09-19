import { Archer, Character, Mage, Pikeman, Scout, Warrior } from "./Character";

export class Player {
  public id: string;
  public characters: Character[];

  constructor(id: string) {
    this.id = id;
    this.characters = this.generateCharacters();
  }

  private generateCharacters(): Character[] {
    return [
      new Warrior(),
      new Warrior(),
      new Archer(),
      new Pikeman(),
      new Mage(),
      new Scout(),
    ];
  }

  public getCharacters(): Character[] {
    return this.characters;
  }

  public getCharacterById(id: string): Character | undefined {
    return this.characters.find((c) => c.id === id);
  }

  public serialize(): object {
    return {
      id: this.id,
      characters: this.characters.map((c) => c.serialize()),
    };
  }
}
