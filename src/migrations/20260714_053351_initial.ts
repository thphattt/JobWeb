import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "services__order_idx";
  DROP INDEX "projects__order_idx";
  DROP INDEX "collaborators__order_idx";
  DROP INDEX "testimonials__order_idx";
  DROP INDEX "clients__order_idx";
  ALTER TABLE "services" DROP COLUMN "_order";
  ALTER TABLE "projects" DROP COLUMN "_order";
  ALTER TABLE "collaborators" DROP COLUMN "_order";
  ALTER TABLE "testimonials" DROP COLUMN "_order";
  ALTER TABLE "clients" DROP COLUMN "_order";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" ADD COLUMN "_order" varchar;
  ALTER TABLE "services" ADD COLUMN "_order" varchar;
  ALTER TABLE "collaborators" ADD COLUMN "_order" varchar;
  ALTER TABLE "testimonials" ADD COLUMN "_order" varchar;
  ALTER TABLE "clients" ADD COLUMN "_order" varchar;
  CREATE INDEX "projects__order_idx" ON "projects" USING btree ("_order");
  CREATE INDEX "services__order_idx" ON "services" USING btree ("_order");
  CREATE INDEX "collaborators__order_idx" ON "collaborators" USING btree ("_order");
  CREATE INDEX "testimonials__order_idx" ON "testimonials" USING btree ("_order");
  CREATE INDEX "clients__order_idx" ON "clients" USING btree ("_order");`)
}
