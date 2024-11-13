import { Migration } from '@mikro-orm/migrations';

export class Migration20241113093449 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "highscore" ("difficulty" varchar(255) not null, "type" varchar(255) not null, "song_id" varchar(255) null, "all_justice" boolean not null, "clear" boolean not null, "full_combo" boolean not null, "score" integer not null, "rating" numeric(10,2) null, constraint "highscore_pkey" primary key ("difficulty", "type", "song_id"));`);

    this.addSql(`alter table "highscore" add constraint "highscore_song_id_foreign" foreign key ("song_id") references "song" ("song_id") on update cascade on delete set null;`);
    this.addSql(`alter table "highscore" add constraint "highscore_song_id_difficulty_type_foreign" foreign key ("song_id", "difficulty", "type") references "sheet" ("song_id", "difficulty", "type") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "highscore" cascade;`);
  }

}
