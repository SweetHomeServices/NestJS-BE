import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1700000000000 implements MigrationInterface {
  name = 'CreateInitialTables1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create clients table
    await queryRunner.query(`
      CREATE TABLE "clients" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "email" varchar NOT NULL,
        "phone" varchar NOT NULL,
        "company" varchar,
        "notes" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Create campaigns table
    await queryRunner.query(`
      CREATE TABLE "campaigns" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "description" text,
        "start_date" TIMESTAMP NOT NULL,
        "end_date" TIMESTAMP,
        "status" varchar NOT NULL DEFAULT 'active',
        "settings" jsonb,
        "client_id" uuid REFERENCES clients(id),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Create leads table
    await queryRunner.query(`
      CREATE TABLE "leads" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "first_name" varchar NOT NULL,
        "last_name" varchar NOT NULL,
        "email" varchar NOT NULL,
        "phone" varchar,
        "additional_info" jsonb,
        "status" varchar NOT NULL DEFAULT 'new',
        "client_id" uuid REFERENCES clients(id),
        "campaign_id" uuid REFERENCES campaigns(id),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Create settings table
    await queryRunner.query(`
      CREATE TABLE "settings" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "key" varchar NOT NULL UNIQUE,
        "value" jsonb NOT NULL,
        "description" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Create indexes
    await queryRunner.query(`CREATE INDEX "idx_clients_email" ON "clients"("email")`);
    await queryRunner.query(`CREATE INDEX "idx_leads_email" ON "leads"("email")`);
    await queryRunner.query(`CREATE INDEX "idx_campaigns_status" ON "campaigns"("status")`);
    await queryRunner.query(`CREATE INDEX "idx_leads_status" ON "leads"("status")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_leads_status"`);
    await queryRunner.query(`DROP INDEX "idx_campaigns_status"`);
    await queryRunner.query(`DROP INDEX "idx_leads_email"`);
    await queryRunner.query(`DROP INDEX "idx_clients_email"`);
    
    await queryRunner.query(`DROP TABLE "leads"`);
    await queryRunner.query(`DROP TABLE "campaigns"`);
    await queryRunner.query(`DROP TABLE "settings"`);
    await queryRunner.query(`DROP TABLE "clients"`);
  }
}