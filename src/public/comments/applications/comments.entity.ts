import { Users } from 'src/super_admin/sa_users/applications/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts } from '../../posts/applications/posts.entity';
import { CommentLikes } from './comments-likes.entity';

@Entity()
export class Comments {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  content: string;
  @Column()
  createdAt: string;
  @Column()
  userLogin: string;
  @Column()
  likeCount: number;
  @Column()
  dislikeCount: number;
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
  @OneToMany(() => CommentLikes, (cl) => cl.comment, {})
  commentLikes: CommentLikes[];
}
