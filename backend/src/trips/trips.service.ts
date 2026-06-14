import {BadRequestException, ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {CreateTripDto} from "./dto/create-trip.dto";

@Injectable()
export class TripsService {
    constructor(private prisma: PrismaService) {
    }

    async create(driverId: string, organizationId: string, dto: CreateTripDto) {
        const office = await this.prisma.office.findFirst({
            where: {
                id: dto.officeId,
                organizationId
            }
        })

        if (!office) {
            throw new BadRequestException('Такой офис не найден в Вашей организации')
        }

        return this.prisma.trip.create({
            data: {
                driverId,
                officeId: dto.officeId,
                startLat: dto.startLat,
                startLng: dto.startLng,
                startAddress: dto.startAddress,
                departureTime: new Date(dto.departureTime),
                seatsTotal: dto.seatsTotal,
            }
        })
    }

    findAll(organizationId: string) {
        return this.prisma.trip.findMany({
            where: {
                status: 'ACTIVE',
                office: {organizationId},
            },
            orderBy: {departureTime: 'asc'},
            include: {
                office: true,
                driver: {select: {id: true, name: true}},
                members: {
                    where: {status: "JOINED"},
                    include: {user: {select: {id: true, name: true}}},
                },
            },
        })
    }

    async findOne(organizationId: string, id: string) {
        const trip = this.prisma.trip.findFirst({
            where: {id, office: {organizationId}},
            include: {
                office: true,
                driver: {select: {id: true, name: true}},
                members: {
                    where: {status: "JOINED"},
                    include: {user: {select: {id: true, name: true}}},
                },
            },
        })

        if (!trip) {
            throw new NotFoundException('Поездка не найдена')
        }

        return trip
    }

    async join(userId: string, organizationId: string, tripId: string) {
        const trip = await this.findOne(organizationId, tripId)

        if (trip?.status !== 'ACTIVE') {
            throw new BadRequestException('Поездка неактивна')
        }

        if (trip.driverId === userId) {
            throw new BadRequestException('Вы водитель этой поездки');
        }

        const user = await this.prisma.user.findUnique({
            where: {id: userId},
            select: {city: true}
        })

        if (!user?.city) {
            throw new BadRequestException('У вас не указан город');
        }

        if (user.city !== trip.office.city) {
            throw new ForbiddenException(
                `Эта поездка в городе ${trip.office.city}, а вы из города ${user.city}`,
            );
        }

        if (trip.members.length >= trip.seatsTotal) {
            throw new BadRequestException('Свободных мест нет')
        }

        const already = trip.members.find(me => me.user.id === userId);
        if (already) {
            throw new BadRequestException('Вы уже в этой поездке')
        }

        const existing = await this.prisma.tripMember.findUnique({
            where: {tripId_userId: {tripId, userId}}
        })

        if (existing?.status === 'JOINED') {
            throw new BadRequestException('Вы уже в этой поездке');
        }

        if (existing) {
            await this.prisma.tripMember.update({
                where: {tripId_userId: {tripId, userId}},
                data: {status: 'JOINED'},
            })
        } else {
            await this.prisma.tripMember.create({
                data: {
                    tripId,
                    userId,
                }
            })
        }

        return this.findOne(organizationId, tripId)
    }

    async leave(userId: string, organizationId: string, tripId: string) {
        const trip = await this.findOne(organizationId, tripId)

        const membership = trip?.members.find(me => me.user.id === userId)
        if (!membership) {
            throw new BadRequestException('Вы не участник этой поездки')
        }

        await this.prisma.tripMember.updateMany({
            where: {tripId, userId, status: 'JOINED'},
            data: {status: 'LEFT'},
        })

        return this.findOne(organizationId, tripId)
    }

    async cancel(userId: string, organizationId: string, id: string) {
        const trip = await this.findOne(organizationId, id)
        if (trip?.driverId !== userId) {
            throw new BadRequestException('Отменить поездку может только ее водитель')
        }

        return this.prisma.trip.update({
            where: {id},
            data: {status: "CANCELLED"},
        })
    }
}
