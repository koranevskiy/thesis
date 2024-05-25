import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from 'src/domain/user/entities/user.entity'
import { Role } from 'src/domain/role/role.entity'
import { BaseEntityModel } from '#system/database/base.entity'


@Entity('users_roles')
export class UserToRole extends BaseEntityModel{
  @PrimaryGeneratedColumn({primaryKeyConstraintName: 'pk_users_roles'})
  id: number

  @Column()
  role_id: number

  @Column()
  user_id: number

  @ManyToOne(() => User, (user) => user.userToRoles)
  user: User

  @ManyToOne(() => Role, (role) => role.userToRoles)
  role: Role
}