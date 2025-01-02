import { MigrationInterface, QueryRunner } from "typeorm";

export class LeadText1735594507745 implements MigrationInterface {
    name = 'LeadText1735594507745'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "leads" ADD "text" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "leads" DROP COLUMN "text"`);
    }

}
