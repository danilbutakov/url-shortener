import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Res,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Response, Request } from 'express';

@Controller('api')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  async create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlService.create(createUrlDto);
  }

  @Get(':shortUrl')
  async redirect(
    @Param('shortUrl') shortUrl: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const ipAddress = req.ip || '0.0.0.0';
    const originalUrl = await this.urlService.redirect(shortUrl, ipAddress);
    return res.redirect(HttpStatus.FOUND, originalUrl);
  }

  @Get('info/:shortUrl')
  async getInfo(@Param('shortUrl') shortUrl: string) {
    return this.urlService.getInfo(shortUrl);
  }

  @Get('analytics/:shortUrl')
  async getAnalytics(@Param('shortUrl') shortUrl: string) {
    return this.urlService.getAnalytics(shortUrl);
  }

  @Delete('delete/:shortUrl')
  async delete(@Param('shortUrl') shortUrl: string) {
    return this.urlService.delete(shortUrl);
  }

  @Get('urls')
  async findAll() {
    return this.urlService.findAll();
  }
}
