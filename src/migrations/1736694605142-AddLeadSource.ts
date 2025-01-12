import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLeadSource1736694605142 implements MigrationInterface {
    name = 'AddLeadSource1736694605142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "leads" ADD "source" character varying NOT NULL DEFAULT 'other'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "leads" DROP COLUMN "source"`);
    }

}
