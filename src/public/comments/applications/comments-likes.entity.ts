import { Users } from 'src/super_admin/sa_users/applications/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comments } from './comments.entity';

@Entity()
export class CommentLikes {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  status: string;
  @Column()
  addedAt: string;
  @ManyToOne(() => Users, (u) => u.id, { cascade: true })
  @JoinColumn({ name: 'userId' })
  user: Users;
  @ManyToOne(() => Comments, (c) => c.id, { cascade: true })
  @JoinColumn({ name: 'commentId' })
  comment: Comments;
}
