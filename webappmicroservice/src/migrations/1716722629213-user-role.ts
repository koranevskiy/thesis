import { MigrationInterface, QueryRunner } from "typeorm";

export class UserRole1716722629213 implements MigrationInterface {
  name = "UserRole1716722629213";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" SERIAL NOT NULL, "password" character varying NOT NULL, "first_name" character varying NOT NULL, "middle_name" character varying, "email" character varying NOT NULL, CONSTRAINT "pk_users" PRIMARY KEY ("user_id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "users_roles" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "role_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "pk_users_roles" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "role_id" SERIAL NOT NULL, "role_name" character varying NOT NULL, CONSTRAINT "UQ_ac35f51a0f17e3e1fe121126039" UNIQUE ("role_name"), CONSTRAINT "pk_roles" PRIMARY KEY ("role_id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles" ADD CONSTRAINT "FK_e4435209df12bc1f001e5360174" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles" ADD CONSTRAINT "FK_1cf664021f00b9cc1ff95e17de4" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(`INSERT into roles (role_name) values('user')`);
    await queryRunner.query(`INSERT into roles (role_name) values('admin')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_1cf664021f00b9cc1ff95e17de4"`);
    await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_e4435209df12bc1f001e5360174"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "users_roles"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
