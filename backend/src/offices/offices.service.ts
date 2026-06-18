import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {CreateOfficeDto} from "./dto/create-office.dto";
import {UpdateOfficeDto} from "./dto/update-office.dto";

@Injectable()
export class OfficesService {
    constructor(private prisma: PrismaService) {}

    async create(organizationId: string, dto: CreateOfficeDto) {
        const EPSILON = 0.0001;

        const existingOffice = await this.prisma.office.findFirst({
            where: {
                organizationId,
                lat: {
                    gte: Number(dto.lat) - EPSILON,
                    lte: Number(dto.lat) + EPSILON,
                },
                lng: {
                    gte: Number(dto.lng) - EPSILON,
                    lte: Number(dto.lng) + EPSILON,
                }
            }
        })

        if (existingOffice) {
            throw new BadRequestException('Офис в этой локации уже существует')
        }

        return this.prisma.office.create({
            data: {
                ...dto,
                organizationId,
            }
        })
    }

    findAll(organizationId: string) {
        if (!organizationId) {
            throw new BadRequestException('Идентификатор организации не указан');
        }

        return this.prisma.office.findMany({
            where: { organizationId },
            orderBy: { name: 'asc' },
        });
    }

    async findOne(organizationId: string, id: string) {
        const office = await this.prisma.office.findFirst({
            where: {id, organizationId},
        })

        if (!office) {
            throw new NotFoundException(`Офис "${organizationId}" не найден`)
        }

        return office;
    }

    async update(organizationId: string, id: string, dto: UpdateOfficeDto) {
        await this.findOne(organizationId, id)
        return this.prisma.office.update({
            where: {id},
            data: dto,
        })
    }

    async remove(organizationId: string, id: string) {
        await this.findOne(organizationId, id);

        return this.prisma.$transaction(async (tx) => {
            const trips = await tx.trip.findMany({
                where: { officeId: id },
                select: { id: true },
            });
            const tripIds = trips.map((t) => t.id);
            if (tripIds.length > 0) {
                await tx.tripMember.deleteMany({ where: { tripId: { in: tripIds } } });
                await tx.trip.deleteMany({ where: { id: { in: tripIds } } });
            }
            await tx.office.delete({ where: { id } });
            return { success: true };
        });
    }
}
