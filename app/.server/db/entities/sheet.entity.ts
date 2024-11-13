import {
  Entity,
  Formula,
  ManyToOne,
  PrimaryKey,
  PrimaryKeyProp,
  Property,
} from "@mikro-orm/core";

import { Song } from "./song.entity.js";
@Entity()
export class Sheet {
  @PrimaryKey({ type: "string" })
  type!: string;

  @PrimaryKey({ type: "string" })
  difficulty!: string;

  @Property({ type: "string", nullable: true })
  level?: string | null;

  @Formula(`CAST(level as DECIMAL)`)
  levelValue?: number | null;

  @Property({ type: "string", nullable: true })
  internalLevel?: string | null;

  @Formula(`CAST(internalLevel as DECIMAL)`)
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

  [PrimaryKeyProp]?: ["songId", "type", "difficulty"];
}
