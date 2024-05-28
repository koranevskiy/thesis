import { MigrationInterface, QueryRunner } from "typeorm";

export class Camera1716928976253 implements MigrationInterface {
  name = "Camera1716928976253";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cameras" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "camera_id" SERIAL NOT NULL, "camera_name" character varying NOT NULL, "uuid_name" uuid NOT NULL DEFAULT uuid_generate_v4(), "file_config_link" character varying NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_d3472a04550d1674e6d6b0bdece" PRIMARY KEY ("camera_id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "cameras" ADD CONSTRAINT "FK_58695417f4659e665bd427b16f2" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cameras" DROP CONSTRAINT "FK_58695417f4659e665bd427b16f2"`);
    await queryRunner.query(`DROP TABLE "cameras"`);
  }
}
