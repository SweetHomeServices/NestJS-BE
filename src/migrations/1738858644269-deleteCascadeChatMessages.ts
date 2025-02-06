import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteCascadeChatMessages1738858644269 implements MigrationInterface {
    name = 'DeleteCascadeChatMessages1738858644269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat-messages" DROP CONSTRAINT "FK_429f857edb631f2853f7183d641"`);
        await queryRunner.query(`ALTER TABLE "chat-messages" ADD CONSTRAINT "FK_429f857edb631f2853f7183d641" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat-messages" DROP CONSTRAINT "FK_429f857edb631f2853f7183d641"`);
        await queryRunner.query(`ALTER TABLE "chat-messages" ADD CONSTRAINT "FK_429f857edb631f2853f7183d641" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
