import {
    ConflictException,
    Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import {generateOrgToken} from "./utils/token.utils";

@Injectable()
export class OrganizationsService {
    constructor(private prisma: PrismaService) {}

    findAll(organizationId: string) {
        return this.prisma.organization.findMany({
            where: {id: organizationId},
            orderBy: {name: 'asc'},
        })
    }

    async getCitiesByToken(token: string): Promise<string[]> {
        const organization = await this.prisma.organization.findUnique({
            where: {inviteToken: token},
            select: {id: true},
        })

        if (!organization) {
            return []
        }

        const offices = await this.prisma.office.findMany({
            where: {organizationId: organization.id},
            select: {city: true},
            distinct: ['city'],
            orderBy: {city: 'asc'}
        })

        return offices.map(office => office.city)
    }
    
    async create(dto: CreateOrganizationDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new ConflictException('Пользователь с таким email уже существует');
        }

        let token = dto.inviteToken?.trim() || generateOrgToken();
        let exists = await this.prisma.organization.findUnique({
            where: { inviteToken: token },
        });
        if (exists && dto.inviteToken) {
            throw new ConflictException('Такой токен организации уже занят');
        }
        while (exists) {
            token = generateOrgToken();
            exists = await this.prisma.organization.findUnique({
                where: { inviteToken: token },
            });
        }

        const passwordHash = await bcrypt.hash(dto.password, 10);

        const result = await this.prisma.$transaction(async (tx) => {
            const organization = await tx.organization.create({
                data: { name: dto.organizationName, inviteToken: token },
            });
            const user = await tx.user.create({
                data: {
                    email: dto.email,
                    name: dto.name,
                    passwordHash,
                    city: dto.city ?? null,
                    role: 'ADMIN',
                    organizationId: organization.id,
                },
            });
            return { organization, user };
        });

        return {
            user: result.user,
            organization: result.organization,
            inviteToken: token,
        };
    }

    async remove(orgId: string) {
        await this.prisma.organization.delete({
            where: { id: orgId },
        })

        return { deletedOrg: true };
    }
}