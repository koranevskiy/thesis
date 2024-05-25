import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'


export class BaseEntityModel extends BaseEntity {

  @ApiProperty()
  @CreateDateColumn({type: 'timestamp with time zone', default: () => "CURRENT_TIMESTAMP"})
  created_at: Date

  @ApiProperty()
  @UpdateDateColumn({type: 'timestamp with time zone', default: () => "CURRENT_TIMESTAMP"})
  update_at: Date
}