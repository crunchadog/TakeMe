import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {CreateOfficeDto} from "./dto/create-office.dto";
import {UpdateOfficeDto} from "./dto/update-office.dto";

@Injectable()
export class OfficesService {
    constructor(private prisma: PrismaService) {}

    create(organizationId: string, dto: CreateOfficeDto) {
        return this.prisma.office.create({
            data: {
                ...dto,
                organizationId,
            }
        })
    }

    findAll(organizationId: string) {
        return this.prisma.office.findMany({
            where: {organizationId},
            orderBy: {name: 'asc'},
        })
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
        await this.prisma.office.delete({
            where: {id}
        })

        return { success: true };
    }
}
