import { Test, TestingModule } from '@nestjs/testing';
import { TripsService } from './trips.service';
import {PrismaService} from "../prisma/prisma.service";
import {BadRequestException, ForbiddenException} from "@nestjs/common";

describe('TripsService ограничение присоединения', () => {
  let service: TripsService;
  let prisma: any

  const mockPrisma = {
    trip: {findFirst: jest.fn()},
    user: { findUnique: jest.fn()},
    tripMember: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    }
  }

  const makeTrip = (overrides = {}) => ({
    id: 'trip-1',
    driverId: 'driver-1',
    status: 'ACTIVE',
    seatsTotal: 2,
    departureTime: new Date(),
    startLat: 22.8,
    startLng: 8.22,
    startAddress: 'Метро Приморская',
    office: { id: 'office-1', city: 'Санкт-Петербург', organizationId: 'org-1' },
    members: [],
    ...overrides,
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        TripsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = moduleRef.get(TripsService);
    prisma = mockPrisma;
  });

  it('пускает пассажира из того же города со свободным местом', async () => {
    prisma.trip.findFirst.mockResolvedValue(makeTrip());
    prisma.user.findUnique.mockResolvedValue({ city: 'Санкт-Петербург' });
    prisma.tripMember.findUnique.mockResolvedValue(null);
    prisma.tripMember.create.mockResolvedValue({});

    await expect(
        service.join('user-2', 'org-1', 'trip-1'),
    ).resolves.toBeDefined();

    expect(prisma.tripMember.create).toHaveBeenCalled();
  });

  it('НЕ пускает пассажира из другого города', async () => {
    prisma.trip.findFirst.mockResolvedValue(makeTrip());
    prisma.user.findUnique.mockResolvedValue({ city: 'Москва' });

    await expect(
        service.join('user-2', 'org-1', 'trip-1'),
    ).rejects.toThrow(ForbiddenException);

    expect(prisma.tripMember.create).not.toHaveBeenCalled();
  });

  it('НЕ пускает, если нет свободных мест', async () => {
    prisma.trip.findFirst.mockResolvedValue(
        makeTrip({
          seatsTotal: 1,
          members: [{ user: { id: 'someone' } }], // место занято
        }),
    );
    prisma.user.findUnique.mockResolvedValue({ city: 'Санкт-Петербург' });

    await expect(
        service.join('user-2', 'org-1', 'trip-1'),
    ).rejects.toThrow(BadRequestException);
  });

  it('НЕ пускает водителя в свою же поездку', async () => {
    prisma.trip.findFirst.mockResolvedValue(makeTrip({ driverId: 'user-2' }));

    await expect(
        service.join('user-2', 'org-1', 'trip-1'),
    ).rejects.toThrow(BadRequestException);
  });

  it('НЕ пускает, если уже присоединён', async () => {
    prisma.trip.findFirst.mockResolvedValue(makeTrip());
    prisma.user.findUnique.mockResolvedValue({ city: 'Санкт-Петербург' });
    prisma.tripMember.findUnique.mockResolvedValue({ status: 'JOINED' });

    await expect(
        service.join('user-2', 'org-1', 'trip-1'),
    ).rejects.toThrow(BadRequestException);
  });
});
