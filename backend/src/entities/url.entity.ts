import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Click } from './click.entity';

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalUrl: string;

  @Column({ unique: true })
  shortUrl: string;

  @Column({ nullable: true })
  alias?: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 0 })
  clickCount: number;

  @OneToMany(() => Click, (click) => click.url, { onDelete: 'CASCADE' })
  clicks: Click[];
}
