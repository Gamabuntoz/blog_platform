import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Blogs } from '../../../blogger/blogger_blogs/applications/blogger-blogs.entity';
import { Comments } from '../../comments/applications/comments.entity';
import { PostLikes } from './posts-likes.entity';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  title: string;
  @Column()
  shortDescription: string;
  @Column()
  content: string;
  @ManyToOne(() => Blogs, (b) => b.id, { cascade: true })
  @JoinColumn({ name: 'blogId' })
  blog: Blogs;
  @Column()
  blogName: string;
  @Column()
  blogId: string;
  @Column()
  createdAt: string;
  @Column()
  likeCount: number;
  @Column()
  dislikeCount: number;
  @OneToMany(() => Comments, (c) => c.post, {})
  comments: Comments[];
  @OneToMany(() => PostLikes, (pl) => pl.post, {})
  postLikes: PostLikes[];
}
