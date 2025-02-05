import { MigrationInterface, QueryRunner } from "typeorm";

export class AddModelToKnowledgeBase1738758401302 implements MigrationInterface {
    name = 'AddModelToKnowledgeBase1738758401302'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "knowledgebases" ADD "model" text NOT NULL DEFAULT 'gpt-4o-mini'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "knowledgebases" DROP COLUMN "model"`);
    }

}
