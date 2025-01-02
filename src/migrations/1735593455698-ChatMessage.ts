import { MigrationInterface, QueryRunner } from "typeorm";

export class ChatMessage1735593455698 implements MigrationInterface {
    name = 'ChatMessage1735593455698'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_campaigns_knowledge_base"`);
        await queryRunner.query(`DROP INDEX "public"."idx_campaigns_type"`);
        await queryRunner.query(`CREATE TABLE "chat-messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" character varying NOT NULL, "text" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "leadId" uuid, CONSTRAINT "PK_fa087ba26131bc9415a4d4fbc45" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "chat-messages" ADD CONSTRAINT "FK_429f857edb631f2853f7183d641" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat-messages" DROP CONSTRAINT "FK_429f857edb631f2853f7183d641"`);
        await queryRunner.query(`DROP TABLE "chat-messages"`);
        await queryRunner.query(`CREATE INDEX "idx_campaigns_type" ON "campaigns" ("type") `);
        await queryRunner.query(`CREATE INDEX "idx_campaigns_knowledge_base" ON "campaigns" ("knowledgeBaseId") `);
    }

}
