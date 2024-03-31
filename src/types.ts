export enum ClassName {
    DRUID = "Druid",
    HUNTER = "Hunter",
    MAGE = "Mage",
    PALADIN = "Paladin",
    PRIEST = "Priest",
    ROGUE = "Rogue",
    SHAMAN = "Shaman",
    WARLOCK = "Warlock",
    WARRIOR = "Warrior",
    DEMONHUNTER = "Demon Hunter",
}

export type Deck = {
  title: string;
  code: string;
  className: ClassName;
  winrate: number | null;
  dust: number;
};