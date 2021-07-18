import { MigrationInterface, QueryRunner } from 'typeorm';

export class CoffeeRefactor1626651142133 implements MigrationInterface {
  // changes being deployed
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "coffee" RENAME COLUMN "name" TO "title"`);
  }

  // roll back changes ; exit strategy
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "coffee" RENAME COLUMN "title" TO "name"`);
  }
}
