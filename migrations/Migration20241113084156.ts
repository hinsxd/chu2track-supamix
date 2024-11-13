import { Migration } from "@mikro-orm/migrations";

export class Migration20241113084156 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "category" ("category" varchar(255) not null, constraint "category_pkey" primary key ("category"));`
    );

    this.addSql(
      `create table "song" ("song_id" varchar(255) not null, "category" varchar(255) not null, "title" varchar(255) not null, "artist" varchar(255) not null, "bpm" int null, "image_name" varchar(255) null, "image_url" varchar(255) null, "version" varchar(255) null, "release_date" date null, constraint "song_pkey" primary key ("song_id"));`
    );

    this.addSql(
      `create table "sheet" ("type" varchar(255) not null, "difficulty" varchar(255) not null, "song_id" varchar(255) not null, "level" varchar(255) null, "level_value" numeric(10,2) null, "internal_level" varchar(255) null, "internal_level_value" numeric(10,2) null, "note_designer" varchar(255) null, "is_special" boolean not null default false, constraint "sheet_pkey" primary key ("type", "difficulty", "song_id"));`
    );

    this.addSql(
      `alter table "sheet" add constraint "sheet_song_id_foreign" foreign key ("song_id") references "song" ("song_id") on update cascade;`
    );
  }
}
