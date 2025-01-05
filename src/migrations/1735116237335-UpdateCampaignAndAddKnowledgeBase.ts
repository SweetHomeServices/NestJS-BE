import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCampaignAndAddKnowledgeBase1735116237335 implements MigrationInterface {
    name = 'UpdateCampaignAndAddKnowledgeBase1735116237335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "knowledgebases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "primary_goal" character varying NOT NULL, "description" text NOT NULL, "spam_filter" character varying NOT NULL, "important_rules" text NOT NULL, "use_emoji_on_response" boolean NOT NULL DEFAULT false, "communication_tone" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_64f56428cb8ba972a0a880c52eb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "campaigns" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "campaigns" DROP COLUMN "settings"`);
        await queryRunner.query(`ALTER TABLE "campaigns" DROP COLUMN "start_date"`);
        await queryRunner.query(`ALTER TABLE "campaigns" DROP COLUMN "end_date"`);
        await queryRunner.query(`ALTER TABLE "campaigns" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaigns" ADD "timezone" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaigns" ADD "campaign_phone" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaigns" ADD "admin_phone" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaigns" ADD "after_hours_message" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaigns" ADD "working_hours" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaigns" ADD "knowledgeBaseId" uuid`);
        await queryRunner.query(`ALTER TABLE "campaigns" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "campaigns" ADD CONSTRAINT "FK_06c225458b175ad3b83af6c8a92" FOREIGN KEY ("knowledgeBaseId") REFERENCES "knowledgebases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE INDEX "idx_campaigns_type" ON "campaigns"("type")`);
        await queryRunner.query(`CREATE INDEX "idx_campaigns_knowledge_base" ON "campaigns"("knowledgeBaseId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaigns" DROP CONSTRAINT "FK_06c225458b175ad3b83af6c8a92"`);
        await queryRunner.query(`ALTER TABLE "campaigns" ALTER COLUMN "status" SET DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "campaigns" DROP COLUMN "knowledgeBaseId"`);
        await queryRunner.query(`ALTER TABLE "campaigns" DROP COLUMN "working_hours"`);
        await queryRunner.query(`ALTER TABLE "campaigns" DROP COLUMN "after_hours_message"`);
        await queryRunner.query(`ALTER TABLE "campaigns" DROP COLUMN "admin_phone"`);
        await queryRunner.query(`ALTER TABLE "campaigns" DROP COLUMN "campaign_phone"`);
        await queryRunner.query(`ALTER TABLE "campaigns" DROP COLUMN "timezone"`);
        await queryRunner.query(`ALTER TABLE "campaigns" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "campaigns" ADD "end_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "campaigns" ADD "start_date" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaigns" ADD "settings" jsonb`);
        await queryRunner.query(`ALTER TABLE "campaigns" ADD "description" text`);
        await queryRunner.query(`DROP TABLE "knowledgebases"`);
    }

}
