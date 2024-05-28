import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserToRole } from "src/domain/user/entities/user-role.entity";
import { BaseEntityModel } from "#system/database/base.entity";

@Entity("users")
export class User extends BaseEntityModel {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: "integer", primaryKeyConstraintName: "pk_users" })
  user_id: number;

  @Column({ select: false })
  password: string;

  @Column({ select: false })
  salt: string;

  @ApiProperty()
  @Column()
  first_name: string;

  @ApiProperty()
  @Column()
  last_name: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  middle_name?: string;

  @ApiProperty()
  @Column()
  email: string;

  @OneToMany(() => UserToRole, entity => entity.user)
  userToRoles: UserToRole[];
}
