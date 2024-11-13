import { Migration } from '@mikro-orm/migrations';

export class Migration20241112160638 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "category" ("category" varchar(255) not null, constraint "category_pkey" primary key ("category"));`);

    this.addSql(`alter table "song" alter column "release_date" type date using ("release_date"::date);`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "category" cascade;`);

    this.addSql(`alter table "song" alter column "release_date" type timestamptz using ("release_date"::timestamptz);`);
  }

}
