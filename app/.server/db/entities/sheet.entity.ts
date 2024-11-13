import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  PrimaryKeyProp,
  Property,
} from "@mikro-orm/core";

import { Highscore } from "./highscore.entity.js";
import { Song } from "./song.entity.js";
@Entity()
export class Sheet {
  @PrimaryKey({ type: "string" })
  type!: string;

  @PrimaryKey({ type: "string" })
  difficulty!: string;

  @Property({ type: "string", nullable: true })
  level?: string | null;

  @Property({
    type: "decimal",
    columnType: "numeric(10,2)",
    nullable: true,
  })
  levelValue?: number | null;

  @Property({ type: "string", nullable: true })
  internalLevel?: string | null;

  @Property({
    type: "decimal",
    columnType: "numeric(10,2)",
    nullable: true,
  })
  internalLevelValue?: number | null;

  @Property({ type: "string", nullable: true })
  noteDesigner?: string | null;

  @Property({ type: "boolean", default: false })
  isSpecial!: boolean;

  @ManyToOne(() => Song, {
    joinColumn: "song_id",
    primary: true,
    type: "string",
  })
  song!: Song;

  @OneToMany(() => Highscore, "sheet")
  highscores = new Collection<Highscore>(this);

  [PrimaryKeyProp]?: ["songId", "type", "difficulty"];
}
