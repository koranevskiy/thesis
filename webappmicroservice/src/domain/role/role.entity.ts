import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { UserToRole } from 'src/domain/user/entities/user-role.entity'
import { BaseEntityModel } from '#system/database/base.entity'


@Entity('roles')
export class Role extends BaseEntityModel{
  @PrimaryGeneratedColumn({type: 'integer', primaryKeyConstraintName: 'pk_roles'})
  role_id: number

  @Column({ unique: true})
  role_name: string

  @OneToMany(() => UserToRole, entity => entity.role)
  userToRoles: UserToRole[]
}