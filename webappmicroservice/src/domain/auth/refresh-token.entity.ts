import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntityModel } from "#system/database/base.entity";
import { User } from "src/domain/user/entities/user.entity";

@Entity("refresh_tokens")
export class RefreshToken extends BaseEntityModel {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column()
  user_id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;
}
