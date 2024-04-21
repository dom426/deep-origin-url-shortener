import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from './Base.entity';
import { Account } from './Account.entity';
@Entity()
export class ShortenedUrl extends BaseEntity {
  @Property()
  url!: string;
  @Property({ unique: true })
  alias!: string;
  @Property({ default: 0 })
  visits = 0;
  @ManyToOne('Account', { nullable: true })
  account?: Account;
}
