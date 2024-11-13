import { Entity, PrimaryKey } from "@mikro-orm/core";

@Entity()
export class Category {
  @PrimaryKey({ type: "string" })
  category!: string;
}
