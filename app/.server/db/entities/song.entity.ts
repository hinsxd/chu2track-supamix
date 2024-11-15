import "reflect-metadata";

import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";

import { Highscore } from "./highscore.entity.js";
import { Sheet } from "./sheet.entity.js";
@Entity()
export class Song {
  @PrimaryKey({ type: "string" })
  songId!: string;

  @Property({ type: "string" })
  category!: string;
  @Property({ type: "string" })
  title!: string;
  @Property({ type: "string" })
  artist!: string;
  @Property({ type: "number", nullable: true })
  bpm?: number | null;

  @Property({ type: "string", nullable: true })
  imageName?: string | null;
  @Property({ type: "string", nullable: true })
  imageUrl?: string | null;

  @Property({ type: "string", nullable: true })
  version?: string | null;
  @Property({ type: "date", nullable: true })
  releaseDate?: Date | null;

  @OneToMany(() => Sheet, "song")
  sheets = new Collection<Sheet>(this);

  @OneToMany(() => Highscore, "song")
  highscores = new Collection<Highscore>(this);
}
