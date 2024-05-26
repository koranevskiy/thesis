import { MigrationInterface, QueryRunner } from "typeorm";

export class UsersRoles1716654031661 implements MigrationInterface {
    name = 'UsersRoles1716654031661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "role_id" SERIAL NOT NULL, "role_name" character varying NOT NULL, CONSTRAINT "UQ_ac35f51a0f17e3e1fe121126039" UNIQUE ("role_name"), CONSTRAINT "PK_09f4c8130b54f35925588a37b6a" PRIMARY KEY ("role_id"))`);
        await queryRunner.query(`CREATE TABLE "users_roles" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "role_id" integer NOT NULL, "user_id" integer NOT NULL, "userUserId" integer, "roleRoleId" integer, CONSTRAINT "PK_1d8dd7ffa37c3ab0c4eefb0b221" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" SERIAL NOT NULL, "password" character varying NOT NULL, "first_name" character varying NOT NULL, "middle_name" character varying, "email" character varying NOT NULL, CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_c0d99e820504d74dadf726beefe" FOREIGN KEY ("userUserId") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_21affdaf3405de1fa0ebdc78551" FOREIGN KEY ("roleRoleId") REFERENCES "roles"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`INSERT into roles (role_name) values('user')`);
        await queryRunner.query(`INSERT into roles (role_name) values('admin')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_21affdaf3405de1fa0ebdc78551"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_c0d99e820504d74dadf726beefe"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "users_roles"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
