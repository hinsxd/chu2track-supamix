import { Seeder } from "@mikro-orm/seeder";

import { entities } from "../app/.server/db/entities/index.js";

import data from "./data.json" assert { type: "json" };
import * as types from "./types.js";

import type { EntityManager } from "@mikro-orm/core";

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const d = data as types.Data;
    await em.upsertMany(
      entities.Song,
      d.songs.map((song) => ({
        songId: song.songId,
        category: song.category,
        title: song.title,
        artist: song.artist,
        bpm: song.bpm,
        imageName: song.imageName,
        version: song.version || undefined,
        releaseDate: song.releaseDate,
        // isNew: song.isNew,
        // isLocked: song.isLocked,
        // comment: song.comment,
      })),
      { onConflictAction: "merge", onConflictFields: ["songId"] }
    );
    await em.upsertMany(
      entities.Sheet,
      d.songs
        .map((song) => {
          const sheets = song.sheets.map((sheet) => {
            const { type, difficulty, level, internalLevel, noteDesigner } =
              sheet;
            return {
              songId: song.songId,
              type,
              difficulty,
              level,
              internalLevel,
              noteDesigner,
              // isNew: sheet.isNew,
              // isLocked: sheet.isLocked,
              // comment: sheet.comment,
            };
          });

          return sheets;
        })
        .flat()
    );
  }
}