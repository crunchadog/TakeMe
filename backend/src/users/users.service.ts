import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {UpdateMeDto} from "./dto/create-me.dto";

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {
    }

    async getMe(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: {id: userId},
            select: {
                id: true, email: true, name: true, role: true,
                city: true, homeAddress: true, homeLat: true, homeLng: true,
                organization: {select: {name: true, inviteToken: true}},
            },
        })

        if (!user) {
            throw new NotFoundException(`Пользователь с ${userId} не найден`)
        }

        return user
    }

    async updateMe(userId: string, dto: UpdateMeDto) {
        return this.prisma.user.update({
            where: {id: userId},
            data: {
                ...(dto.name !== undefined && { name: dto.name }),
                ...(dto.city !== undefined && { city: dto.city }),
                ...(dto.homeAddress !== undefined && { homeAddress: dto.homeAddress }),
                ...(dto.homeLat !== undefined && { homeLat: dto.homeLat }),
                ...(dto.homeLng !== undefined && { homeLng: dto.homeLng }),
                ...(dto.avatarColor !== undefined && { avatarColor: dto.avatarColor }),
            },
            select: {
                id: true, email: true, name: true, role: true,
                city: true, homeAddress: true, homeLat: true, homeLng: true,
                avatarColor: true,
                organization: {select: {name: true, inviteToken: true}},
            }
        })
    }
}
