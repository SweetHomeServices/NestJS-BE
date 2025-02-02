import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUploadInfoToKB1738505273719 implements MigrationInterface {
    name = 'AddUploadInfoToKB1738505273719'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "knowledgebases" ADD "s3Key" text`);
        await queryRunner.query(`ALTER TABLE "knowledgebases" ADD "extractedText" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "knowledgebases" DROP COLUMN "extractedText"`);
        await queryRunner.query(`ALTER TABLE "knowledgebases" DROP COLUMN "s3Key"`);
    }

}
