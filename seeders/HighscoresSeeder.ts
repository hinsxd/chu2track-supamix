import { Seeder } from "@mikro-orm/seeder";

// import { entities } from "../app/.server/db/entities/index.js";

import highscores from "./highscores.json" assert { type: "json" };

export interface HighscoreData {
  id: string;
  title: string;
  allJustice: boolean;
  clear: boolean;
  diff: string;
  fullCombo: boolean;
  score: number;
  rating: number;
}

import type { EntityManager } from "@mikro-orm/core";

export class HighscoresSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const d = highscores as HighscoreData[];
  }
}
