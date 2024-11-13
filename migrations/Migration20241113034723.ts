import { Migration } from '@mikro-orm/migrations';

export class Migration20241113034723 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "sheet" alter column "level" type varchar(255) using ("level"::varchar(255));`);
    this.addSql(`alter table "sheet" alter column "level" drop not null;`);
    this.addSql(`alter table "sheet" alter column "internal_level" type varchar(255) using ("internal_level"::varchar(255));`);
    this.addSql(`alter table "sheet" alter column "internal_level" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "sheet" alter column "level" type varchar(255) using ("level"::varchar(255));`);
    this.addSql(`alter table "sheet" alter column "level" set not null;`);
    this.addSql(`alter table "sheet" alter column "internal_level" type varchar(255) using ("internal_level"::varchar(255));`);
    this.addSql(`alter table "sheet" alter column "internal_level" set not null;`);
  }

}
