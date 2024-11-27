"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInitialTables1700000000000 = void 0;
class CreateInitialTables1700000000000 {
    constructor() {
        this.name = 'CreateInitialTables1700000000000';
    }
    async up(queryRunner) {
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
        await queryRunner.query(`CREATE INDEX "idx_clients_email" ON "clients"("email")`);
        await queryRunner.query(`CREATE INDEX "idx_leads_email" ON "leads"("email")`);
        await queryRunner.query(`CREATE INDEX "idx_campaigns_status" ON "campaigns"("status")`);
        await queryRunner.query(`CREATE INDEX "idx_leads_status" ON "leads"("status")`);
    }
    async down(queryRunner) {
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
exports.CreateInitialTables1700000000000 = CreateInitialTables1700000000000;
//# sourceMappingURL=1700000000000-CreateInitialTables.js.map