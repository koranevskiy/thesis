import { MigrationInterface, QueryRunner } from "typeorm";

export class UserLastName1716723952819 implements MigrationInterface {
  name = "UserLastName1716723952819";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "last_name" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_name"`);
  }
}
