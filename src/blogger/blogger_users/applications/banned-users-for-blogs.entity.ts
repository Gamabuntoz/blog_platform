import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../../../super_admin/sa_users/applications/users.entity';
import { Blogs } from '../../blogger_blogs/applications/blogger-blogs.entity';

@Entity()
export class BanUserForBlog {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Blogs, (b) => b.id, { cascade: true })
  @JoinColumn({ name: 'blogId' })
  blog: Blogs;
  @Column()
  blogId: string;
  @Column()
  isBanned: boolean;
  @Column({ nullable: true })
  banDate: string | null;
  @Column()
  createdAt: string;
  @Column({ nullable: true })
  banReason: string | null;
  @OneToOne(() => Users, (u) => u.id, { cascade: true })
  @JoinColumn({ name: 'userId' })
  user: Users;
  @Column()
  userId: string;
  @Column()
  userLogin: string;
}
