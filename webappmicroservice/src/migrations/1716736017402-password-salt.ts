import { MigrationInterface, QueryRunner } from "typeorm";

export class PasswordSalt1716736017402 implements MigrationInterface {
  name = "PasswordSalt1716736017402";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "salt" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "salt"`);
  }
}
