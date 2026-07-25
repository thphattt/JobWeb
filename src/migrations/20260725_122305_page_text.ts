import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "page_text" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "page_text_locales" (
  	"projects_eyebrow" varchar,
  	"projects_title" varchar,
  	"projects_director_title" varchar,
  	"projects_director_lead" varchar,
  	"projects_producer_title" varchar,
  	"projects_producer_lead" varchar,
  	"about_eyebrow" varchar,
  	"about_title" varchar,
  	"about_lead" varchar,
  	"services_eyebrow" varchar,
  	"services_title" varchar,
  	"services_lead" varchar,
  	"news_eyebrow" varchar,
  	"news_title" varchar,
  	"news_lead" varchar,
  	"careers_eyebrow" varchar,
  	"careers_title" varchar,
  	"careers_lead" varchar,
  	"contact_eyebrow" varchar,
  	"contact_title" varchar,
  	"contact_lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "page_text_locales" ADD CONSTRAINT "page_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_text"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "page_text_locales_locale_parent_id_unique" ON "page_text_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "page_text" CASCADE;
  DROP TABLE "page_text_locales" CASCADE;`)
}
