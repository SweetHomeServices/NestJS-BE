import { MigrationInterface, QueryRunner } from "typeorm";

export class AddZipcodeToLead1737031698791 implements MigrationInterface {
    name = 'AddZipcodeToLead1737031698791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "leads" ADD "zipcode" character varying NOT NULL DEFAULT 'NA'`);
        await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "phone" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "phone" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "leads" DROP COLUMN "zipcode"`);
    }

}
