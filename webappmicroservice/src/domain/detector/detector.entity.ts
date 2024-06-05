import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntityModel } from "#system/database/base.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Camera } from "src/domain/camera/camera.entity";

@Entity("detections")
export class Detection extends BaseEntityModel {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  detection_id: number;

  @ApiProperty()
  @Column()
  event_text: string;

  @ApiProperty()
  @Column()
  detection_json_link: string;

  @ApiProperty()
  @Column()
  original_image_link: string;

  @ApiProperty()
  @Column()
  annotated_image_link: string;

  @ApiProperty()
  @Column()
  camera_id: number;

  @ManyToOne(() => Camera)
  @JoinColumn({ name: "camera_id" })
  camera: Camera;
}
