import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Song {
  @PrimaryKey()
  songId!: string;

  @Property()
  category!: string;
  @Property()
  title!: string;
  @Property()
  artist!: string;

  @Property({ nullable: true })
  imageName?: string;
  @Property({ nullable: true })
  imageUrl?: string;

  @Property({ nullable: true })
  version?: string;
  @Property({ nullable: true })
  releaseDate?: Date;
}
