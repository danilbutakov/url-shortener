import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { Url } from '../entities/url.entity';
import { Click } from '../entities/click.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Url, Click])],
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {}
