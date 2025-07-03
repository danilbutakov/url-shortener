import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Url } from '../entities/url.entity';
import { Click } from '../entities/click.entity';
import { Repository } from 'typeorm';

describe('UrlController', () => {
  let controller: UrlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        UrlService,
        {
          provide: getRepositoryToken(Url),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Click),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
