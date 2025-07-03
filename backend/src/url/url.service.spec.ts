import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from '../entities/url.entity';

describe('UrlController', () => {
  let controller: UrlController;

  const mockUrlService = {
    create: jest.fn(),
    redirect: jest.fn(),
    getInfo: jest.fn(),
    getAnalytics: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: mockUrlService,
        },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
  });

  it('должен быть определен', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('должен создавать короткий URL', async () => {
      const dto: CreateUrlDto = { originalUrl: 'https://example.com' };
      const result: Url = {
        id: 1,
        originalUrl: 'https://example.com',
        shortUrl: 'abc123',
        createdAt: new Date(),
        clickCount: 0,
        clicks: [],
      };
      mockUrlService.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toBe(result);
      expect(mockUrlService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('redirect', () => {
    it('должен перенаправлять на оригинальный URL', async () => {
      const shortUrl = 'abc123';
      const originalUrl = 'https://example.com';
      const req = { ip: '127.0.0.1' };
      const res = { redirect: jest.fn() };
      mockUrlService.redirect.mockResolvedValue(originalUrl);

      await controller.redirect(shortUrl, req as any, res as any);
      expect(mockUrlService.redirect).toHaveBeenCalledWith(
        shortUrl,
        '127.0.0.1',
      );
      expect(res.redirect).toHaveBeenCalledWith(302, originalUrl);
    });
  });

  describe('getInfo', () => {
    it('должен возвращать информацию о URL', async () => {
      const shortUrl = 'abc123';
      const result: Url = {
        id: 1,
        originalUrl: 'https://example.com',
        shortUrl: 'abc123',
        createdAt: new Date(),
        clickCount: 0,
        clicks: [],
      };
      mockUrlService.getInfo.mockResolvedValue(result);

      expect(await controller.getInfo(shortUrl)).toBe(result);
      expect(mockUrlService.getInfo).toHaveBeenCalledWith(shortUrl);
    });
  });

  describe('getAnalytics', () => {
    it('должен возвращать данные аналитики', async () => {
      const shortUrl = 'abc123';
      const result = { clickCount: 5, lastIps: ['127.0.0.1', '192.168.1.1'] };
      mockUrlService.getAnalytics.mockResolvedValue(result);

      expect(await controller.getAnalytics(shortUrl)).toBe(result);
      expect(mockUrlService.getAnalytics).toHaveBeenCalledWith(shortUrl);
    });
  });

  describe('delete', () => {
    it('должен удалять короткий URL', async () => {
      const shortUrl = 'abc123';
      mockUrlService.delete.mockResolvedValue(undefined);

      await controller.delete(shortUrl);
      expect(mockUrlService.delete).toHaveBeenCalledWith(shortUrl);
    });
  });

  describe('findAll', () => {
    it('должен возвращать все URL', async () => {
      const result: Url[] = [
        {
          id: 1,
          originalUrl: 'https://example.com',
          shortUrl: 'abc123',
          createdAt: new Date(),
          clickCount: 0,
          clicks: [],
        },
      ];
      mockUrlService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(mockUrlService.findAll).toHaveBeenCalled();
    });
  });
});
