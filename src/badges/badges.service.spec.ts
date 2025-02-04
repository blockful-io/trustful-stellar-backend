import { Test, TestingModule } from '@nestjs/testing';
import { BadgesService } from './badges.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { BadgeDto } from './dto/badge.dto';

describe('BadgesService', () => {
  let service: BadgesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    badge: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BadgesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BadgesService>(BadgesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findBadgesByType', () => {
    it('should return badges when they exist', async () => {
      const mockBadges = [
        { id: 1, type: 'achievement', name: 'First Win' },
        { id: 2, type: 'achievement', name: 'Champion' },
      ];

      mockPrismaService.badge.findMany.mockResolvedValue(mockBadges);

      const result = await service.findBadgesByType('achievement');

      expect(result).toEqual(mockBadges);
      expect(prisma.badge.findMany).toHaveBeenCalledWith({
        where: { type: 'achievement' },
      });
    });

    it('should throw NotFoundException when no badges are found', async () => {
      mockPrismaService.badge.findMany.mockResolvedValue([]);

      await expect(service.findBadgesByType('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createBadge', () => {
    it('should create and return a new badge', async () => {
      const badgeDto: BadgeDto = {
        type: 'Custom',
        name: 'New Badge',
        score: 100,
        issuer: '0x1234567890',
        contractAddress: '0x1234567890',
      };

      const mockCreatedBadge = {
        id: 1,
        ...badgeDto,
      };

      mockPrismaService.badge.create.mockResolvedValue(mockCreatedBadge);

      const result = await service.createBadge(badgeDto);

      expect(result).toEqual(mockCreatedBadge);
      expect(prisma.badge.create).toHaveBeenCalledWith({
        data: badgeDto,
      });
    });
  });
});
