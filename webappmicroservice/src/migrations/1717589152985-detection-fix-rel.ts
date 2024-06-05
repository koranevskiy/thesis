import { MigrationInterface, QueryRunner } from "typeorm";

export class DetectionFixRel1717589152985 implements MigrationInterface {
  name = "DetectionFixRel1717589152985";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "detections" DROP CONSTRAINT "FK_e018888fb115f9c3079ff21adf1"`);
    await queryRunner.query(`ALTER TABLE "detections" DROP CONSTRAINT "REL_e018888fb115f9c3079ff21adf"`);
    await queryRunner.query(
      `ALTER TABLE "detections" ADD CONSTRAINT "FK_e018888fb115f9c3079ff21adf1" FOREIGN KEY ("camera_id") REFERENCES "cameras"("camera_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "detections" DROP CONSTRAINT "FK_e018888fb115f9c3079ff21adf1"`);
    await queryRunner.query(
      `ALTER TABLE "detections" ADD CONSTRAINT "REL_e018888fb115f9c3079ff21adf" UNIQUE ("camera_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "detections" ADD CONSTRAINT "FK_e018888fb115f9c3079ff21adf1" FOREIGN KEY ("camera_id") REFERENCES "cameras"("camera_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
