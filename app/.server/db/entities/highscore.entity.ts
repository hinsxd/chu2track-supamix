import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";

import { Sheet } from "./sheet.entity.js";
import { Song } from "./song.entity.js";

@Entity()
export class Highscore {
  @PrimaryKey({ type: "string" })
  id!: string;

  @Property({ type: "string" })
  type!: string;

  @Property({ type: "string" })
  title!: string;

  @Property({ type: "boolean" })
  allJustice!: boolean;

  @Property({ type: "boolean" })
  clear!: boolean;

  @Property({ type: "string" })
  difficulty!: string;

  @Property({ type: "boolean" })
  fullCombo!: boolean;

  @Property({ type: "number" })
  score!: number;

  @Property({
    type: "decimal",
    nullable: true,
    columnType: "numeric(10,2)",
  })
  rating?: number | null;

  @ManyToOne("Song", {
    joinColumns: ["song_id"],
    nullable: true,
  })
  song?: Song | null;

  @ManyToOne("Sheet", {
    joinColumns: ["song_id", "difficulty", "type"],
    referencedColumnNames: ["song_id", "difficulty", "type"],
    nullable: true,
  })
  sheet?: Sheet | null;
}
