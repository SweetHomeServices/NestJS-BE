import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameClientsTable1735072938668 implements MigrationInterface {
    name = '1735072846RenameClientsTable1735072938668'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "firstName" character varying`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "lastName" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "last_name" character varying`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "first_name" character varying`);
    }

}
