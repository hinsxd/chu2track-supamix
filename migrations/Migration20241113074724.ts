import { Migration } from "@mikro-orm/migrations";

export class Migration20241113074724 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "sheet" drop constraint "sheet_pkey";`);

    this.addSql(
      `alter table "sheet" add constraint "sheet_song_id_foreign" foreign key ("song_id") references "song" ("song_id") on update cascade;`
    );
    this.addSql(
      `alter table "sheet" add constraint "sheet_pkey" primary key ("type", "difficulty", "song_id");`
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "sheet" drop constraint "sheet_song_id_foreign";`);

    this.addSql(`alter table "sheet" drop constraint "sheet_pkey";`);

    this.addSql(
      `alter table "sheet" add constraint "sheet_pkey" primary key ("song_id", "type", "difficulty");`
    );
  }
}
