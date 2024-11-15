import "reflect-metadata";
import {
  Entity,
  ManyToOne,
  PrimaryKey,
  PrimaryKeyProp,
  Property,
} from "@mikro-orm/core";

import { Sheet } from "./sheet.entity.js";
import { Song } from "./song.entity.js";

@Entity()
export class Highscore {
  [PrimaryKeyProp]?: ["difficulty", "type", "songId"];

  @PrimaryKey({ type: "string" })
  difficulty!: string;

  @PrimaryKey({ type: "string" })
  type!: string;

  @Property({ type: "boolean" })
  allJustice!: boolean;

  @Property({ type: "boolean" })
  clear!: boolean;

  @Property({ type: "boolean" })
  fullCombo!: boolean;

  @Property({ type: "integer", columnType: "integer" })
  score!: number;

  @Property({
    type: "decimal",
    nullable: true,
    columnType: "numeric(10,2)",
  })
  rating?: string | null;

  @ManyToOne("Song", {
    joinColumns: ["song_id"],
    referencedColumnNames: ["song_id"],
    nullable: true,
    primary: true,
  })
  song?: Song | null;

  @ManyToOne("Sheet", {
    joinColumns: ["song_id", "difficulty", "type"],
    referencedColumnNames: ["song_id", "difficulty", "type"],
    nullable: true,
  })
  sheet?: Sheet | null;
}
