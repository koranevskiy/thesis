import { MigrationInterface, QueryRunner } from "typeorm";

export class Detection1717586407076 implements MigrationInterface {
  name = "Detection1717586407076";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "detections" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "detection_id" SERIAL NOT NULL, "event_text" character varying NOT NULL, "detection_json_link" character varying NOT NULL, "original_image_link" character varying NOT NULL, "annotated_image_link" character varying NOT NULL, "camera_id" integer NOT NULL, CONSTRAINT "REL_e018888fb115f9c3079ff21adf" UNIQUE ("camera_id"), CONSTRAINT "PK_0bb008a7302cb4ab62ff83be72b" PRIMARY KEY ("detection_id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "detections" ADD CONSTRAINT "FK_e018888fb115f9c3079ff21adf1" FOREIGN KEY ("camera_id") REFERENCES "cameras"("camera_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "detections" DROP CONSTRAINT "FK_e018888fb115f9c3079ff21adf1"`);
    await queryRunner.query(`DROP TABLE "detections"`);
  }
}
