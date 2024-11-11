import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

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

  @Property({ type: "string", nullable: true })
  imageName?: string;
  @Property({ type: "string", nullable: true })
  imageUrl?: string;

  @Property({ type: "string", nullable: true })
  version?: string;
  @Property({ type: "date", nullable: true })
  releaseDate?: Date;
}
