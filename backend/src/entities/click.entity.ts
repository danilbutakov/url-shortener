import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Url } from './url.entity';

@Entity()
export class Click {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ipAddress: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Url, (url) => url.clicks, { onDelete: 'CASCADE' })
  url: Url;
}

// Команды для применения onDelete: 'CASCADE':
// docker exec -it url-shortener-db-1 psql -U postgres -d url_shortener
// ALTER TABLE click DROP CONSTRAINT "FK_c2f71156bfb882effa9a8471495";
// ALTER TABLE click ADD CONSTRAINT "FK_c2f71156bfb882effa9a8471495"
// FOREIGN KEY ("urlId") REFERENCES url(id) ON DELETE CASCADE;
