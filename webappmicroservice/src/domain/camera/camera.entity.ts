import { BaseEntityModel } from "#system/database/base.entity";
import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/domain/user/entities/user.entity";

export class CameraConfig {
  @ApiProperty()
  rtsp_link: string;

  @ApiProperty()
  minio_login: string;

  @ApiProperty()
  minio_password: string;
}

@Entity("cameras")
export class Camera extends BaseEntityModel {
  @ApiProperty({ type: CameraConfig })
  config: CameraConfig;

  @ApiProperty()
  @PrimaryGeneratedColumn()
  camera_id: number;

  @ApiProperty()
  @Column()
  camera_name: string;

  @ApiProperty()
  @Column()
  @Generated("uuid")
  uuid_name: string;

  @ApiProperty()
  @Column()
  file_config_link: string;

  @ApiProperty()
  @Column()
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;
}
