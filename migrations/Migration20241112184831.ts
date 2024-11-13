import { Migration } from "@mikro-orm/migrations";

export class Migration20241112184831 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "song" add column "bpm" int;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "song" drop column "bpm";`);
  }
}
