import { Users } from 'src/super_admin/sa_users/applications/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts } from './posts.entity';

@Entity()
export class PostLikes {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  status: string;
  @Column()
  addedAt: string;
  @ManyToOne(() => Users, (u) => u.id, { cascade: true })
  @JoinColumn({ name: 'userId' })
  user: Users;
  @Column()
  userId: string;
  @ManyToOne(() => Posts, (p) => p.id, { cascade: true })
  @JoinColumn({ name: 'postId' })
  post: Posts;
  @Column()
  postId: string;
}
