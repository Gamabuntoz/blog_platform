import { Users } from 'src/super_admin/sa_users/applications/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts } from '../../../public/posts/applications/posts.entity';
import { BanUserForBlog } from '../../blogger_users/applications/banned-users-for-blogs.entity';

@Entity()
export class Blogs {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  createdAt: string;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  websiteUrl: string;
  @Column()
  isMembership: boolean;
  @ManyToOne(() => Users, (u) => u.id, { cascade: true })
  @JoinColumn({ name: 'userId' })
  user: Users;
  @Column()
  ownerLogin: string;
  @Column()
  blogIsBanned: boolean;
  @Column({ nullable: true })
  blogBanDate: string | null;
  @OneToMany(() => Posts, (p) => p.blog, {})
  post: Posts[];
  @OneToOne(() => BanUserForBlog, (bub) => bub.blog, {})
  banUserForBlog: BanUserForBlog[];
}
