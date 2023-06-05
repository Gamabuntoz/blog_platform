import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Devices } from '../../../public/devices/applications/devices.entity';
import { Comments } from '../../../public/comments/applications/comments.entity';
import { CommentLikes } from '../../../public/comments/applications/comments-likes.entity';
import { PostLikes } from '../../../public/posts/applications/posts-likes.entity';
import { Blogs } from '../../../blogger/blogger_blogs/applications/blogger-blogs.entity';
import { BanUserForBlog } from '../../../blogger/blogger_users/applications/banned-users-for-blogs.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  login: string;
  @Column()
  email: string;
  @Column()
  passwordHash: string;
  @Column()
  createdAt: string;
  @Column()
  emailConfirmationCode: string;
  @Column()
  emailIsConfirmed: boolean;
  @Column()
  emailConfirmExpirationDate: string;
  @Column({ nullable: true })
  passwordRecoveryCode: string | null;
  @Column({ nullable: true })
  passwordRecoveryExpirationDate: string | null;
  @Column()
  userIsBanned: boolean;
  @Column({ nullable: true })
  userBanReason: string | null;
  @Column({ nullable: true })
  userBanDate: string | null;
  @OneToMany(() => Devices, (d) => d.user, {})
  devices: Devices[];
  @OneToMany(() => Comments, (c) => c.user, {})
  comments: Comments[];
  @OneToMany(() => CommentLikes, (cl) => cl.user, {})
  commentLikes: CommentLikes[];
  @OneToMany(() => CommentLikes, (pl) => pl.user, {})
  postLikes: PostLikes[];
  @OneToMany(() => Blogs, (b) => b.user, {})
  blogs: Blogs[];
  @OneToOne(() => BanUserForBlog, (bub) => bub.user, {})
  banUserForBlog: BanUserForBlog[];
}
