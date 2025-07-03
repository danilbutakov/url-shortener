import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from '../entities/url.entity';
import { Click } from '../entities/click.entity';
import { CreateUrlDto } from './dto/create-url.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
    @InjectRepository(Click)
    private clickRepository: Repository<Click>,
  ) {}

  async create(createUrlDto: CreateUrlDto): Promise<Url> {
    const { originalUrl, alias, expiresAt } = createUrlDto;
    const shortUrl = alias || nanoid(6);
    const url = this.urlRepository.create({
      originalUrl,
      shortUrl,
      alias: alias || undefined,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });
    return this.urlRepository.save(url);
  }

  async redirect(shortUrl: string, ipAddress: string): Promise<string> {
    const url = await this.urlRepository.findOne({ where: { shortUrl } });
    if (!url) throw new NotFoundException('URL not found');
    if (url.expiresAt && new Date() > url.expiresAt) {
      await this.urlRepository.delete(url.id);
      throw new NotFoundException('URL has expired');
    }
    url.clickCount += 1;
    await this.urlRepository.save(url);
    const click = this.clickRepository.create({ ipAddress, url });
    await this.clickRepository.save(click);
    return url.originalUrl;
  }

  async getInfo(shortUrl: string): Promise<Url> {
    const url = await this.urlRepository.findOne({ where: { shortUrl } });
    if (!url) throw new NotFoundException('URL not found');
    return url;
  }

  async getAnalytics(shortUrl: string) {
    const url = await this.urlRepository.findOne({
      where: { shortUrl },
      relations: ['clicks'],
    });
    if (!url) throw new NotFoundException('URL not found');
    const lastIps = url.clicks
      .slice(-5)
      .map((click) => click.ipAddress)
      .reverse();
    return { clickCount: url.clickCount, lastIps };
  }

  async delete(shortUrl: string): Promise<void> {
    const url = await this.urlRepository.findOne({ where: { shortUrl } });
    if (!url) throw new NotFoundException('URL not found');
    // Ручное удаление связанных записей в click
    await this.clickRepository.delete({ url: { id: url.id } });
    await this.urlRepository.delete(url.id);
  }

  async findAll(): Promise<Url[]> {
    return this.urlRepository.find({
      select: [
        'id',
        'originalUrl',
        'shortUrl',
        'alias',
        'createdAt',
        'clickCount',
      ],
    });
  }
}
