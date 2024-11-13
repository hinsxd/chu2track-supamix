import {
  Entity,
  Formula,
  PrimaryKey,
  PrimaryKeyProp,
  Property,
} from "@mikro-orm/core";

@Entity()
export class Sheet {
  @PrimaryKey({ type: "string" })
  songId!: string;

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

  [PrimaryKeyProp]?: ["songId", "type", "difficulty"];
}
