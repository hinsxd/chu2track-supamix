import { Migration } from '@mikro-orm/migrations';

export class Migration20241113033006 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "sheet" ("song_id" varchar(255) not null, "type" varchar(255) not null, "difficulty" varchar(255) not null, "level" varchar(255) not null, constraint "sheet_pkey" primary key ("song_id", "type", "difficulty"));`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "sheet" cascade;`);
  }

}
