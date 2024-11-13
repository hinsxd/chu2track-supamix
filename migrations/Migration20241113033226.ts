import { Migration } from '@mikro-orm/migrations';

export class Migration20241113033226 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "sheet" add column "internal_level" varchar(255) not null, add column "note_designer" varchar(255) null, add column "is_special" boolean not null default false;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "sheet" drop column "internal_level", drop column "note_designer", drop column "is_special";`);
  }

}
