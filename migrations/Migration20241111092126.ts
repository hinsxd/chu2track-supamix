import { Migration } from "@mikro-orm/migrations";

export class Migration20241111092126 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "song" ("song_id" varchar(255) not null, "category" varchar(255) not null, "title" varchar(255) not null, "artist" varchar(255) not null, "image_name" varchar(255) null, "image_url" varchar(255) null, "version" varchar(255) null, "release_date" timestamptz null, constraint "song_pkey" primary key ("song_id"));`
    );
  }
}
