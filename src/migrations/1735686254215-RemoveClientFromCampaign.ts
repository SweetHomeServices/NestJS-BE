import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveClientFromCampaign1735686254215 implements MigrationInterface {
    name = 'RemoveClientFromCampaign1735686254215'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaigns" DROP CONSTRAINT "FK_e61692e4fb96f6444339a1485e1"`);
        await queryRunner.query(`ALTER TABLE "campaigns" DROP COLUMN "clientId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaigns" ADD "clientId" uuid`);
        await queryRunner.query(`ALTER TABLE "campaigns" ADD CONSTRAINT "FK_e61692e4fb96f6444339a1485e1" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
