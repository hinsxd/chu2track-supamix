import { Seeder } from "@mikro-orm/seeder";

import { entities } from "../app/.server/db/entities/index.js";

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

const diffMap: Record<string, string> = {
  BAS: "basic",
  ADV: "advanced",
  EXP: "expert",
  MAS: "master",
  ULT: "ultima",
};

export class HighscoresSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const d = highscores as HighscoreData[];
    const songs = await em.findAll(entities.Song);

    await em.upsertMany(
      entities.Highscore,
      d.map((highscore) => {
        const song = songs.find((song) => song.songId === highscore.title);
        return {
          difficulty: diffMap[highscore.diff],
          type: "std",
          song: song?.songId as any,
          allJustice: highscore.allJustice,
          clear: highscore.clear,
          fullCombo: highscore.fullCombo,
          score: highscore.score,
          rating: highscore.rating,
        };
      }),
      {
        onConflictAction: "merge",
        onConflictFields: ["difficulty", "type", "song"],
      }
    );
  }
}
