import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateClientsTable1700000000002 implements MigrationInterface {
  name = 'UpdateClientsTable1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns
    await queryRunner.query(`
      ALTER TABLE "clients" 
      ADD COLUMN "first_name" varchar,
      ADD COLUMN "last_name" varchar
    `);

    // Copy existing name data to first_name
    await queryRunner.query(`
      UPDATE "clients"
      SET "first_name" = "name"
    `);


    // Drop the old name column
    await queryRunner.query(`
      ALTER TABLE "clients"
      DROP COLUMN "name"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recreate the name column
    await queryRunner.query(`
      ALTER TABLE "clients"
      ADD COLUMN "name" varchar
    `);

    // Copy first_name to name
    await queryRunner.query(`
      UPDATE "clients"
      SET "name" = "first_name"
    `);

    // Make name required
    await queryRunner.query(`
      ALTER TABLE "clients"
      ALTER COLUMN "name" SET NOT NULL
    `);

    // Drop the new columns
    await queryRunner.query(`
      ALTER TABLE "clients"
      DROP COLUMN "first_name",
      DROP COLUMN "last_name"
    `);
  }
}