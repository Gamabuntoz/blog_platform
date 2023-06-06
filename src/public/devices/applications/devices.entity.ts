import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../../../super_admin/sa_users/applications/users.entity';

@Entity()
export class Devices {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'numeric' })
  issueAt: number;
  @Column({ type: 'numeric' })
  expiresAt: number;
  @Column()
  ipAddress: string;
  @Column()
  deviceName: string;
  @ManyToOne(() => Users, (u) => u.id, { cascade: true })
  @JoinColumn({ name: 'userId' })
  user: Users;
  @Column()
  userId: string;
}
