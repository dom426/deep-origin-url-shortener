import { Migration } from '@mikro-orm/migrations';

export class Migration20240421174222 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "account" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "username" varchar(255) not null, "password" varchar(255) not null, "last_logged_in" timestamptz null);');

    this.addSql('create table "shortened_url" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "url" varchar(255) not null, "alias" varchar(255) not null, "visits" int not null default 0, "account_id" int null);');
    this.addSql('alter table "shortened_url" add constraint "shortened_url_alias_unique" unique ("alias");');

    this.addSql('alter table "shortened_url" add constraint "shortened_url_account_id_foreign" foreign key ("account_id") references "account" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "shortened_url" drop constraint "shortened_url_account_id_foreign";');

    this.addSql('drop table if exists "account" cascade;');

    this.addSql('drop table if exists "shortened_url" cascade;');
  }

}
