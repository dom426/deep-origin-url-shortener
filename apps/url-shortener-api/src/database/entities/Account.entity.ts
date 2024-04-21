import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from './Base.entity';
import { ShortenedUrl } from './ShortenedUrl.entity';
@Entity()
export class Account extends BaseEntity {
  @Property()
  username!: string;
  @Property()
  password!: string;
  @Property({ onUpdate: () => new Date(), nullable: true })
  lastLoggedIn?: Date;
  @OneToMany('ShortenedUrl', 'account')
  shortenedUrls?: Collection<ShortenedUrl>;
}
