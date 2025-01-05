import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveClientFromCampaign1735686254215 implements MigrationInterface {
    name = 'RemoveClientFromCampaign1735686254215'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE "campaigns" DROP COLUMN "clientId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaigns" ADD "clientId" uuid`);
       
    }

}
