import * as bcrypt from 'bcryptjs';
import {ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';

import {PrismaService} from "../prisma/prisma.service";
import {JwtService} from "@nestjs/jwt";
import {RegisterDto} from "./dto/register.dto";
import {LoginDto} from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService
    ) {
    }

    async register(dto: RegisterDto) {
        const organization = await this.prisma.organization.findUnique({
            where: { inviteToken: dto.organizationToken },
        });
        if (!organization) {
            throw new UnauthorizedException('Неверный токен организации');
        }

        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existing) {
            throw new ConflictException('Пользователь с таким email уже существует');
        }

        const passwordHash = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                name: dto.name,
                passwordHash,
                city: dto.city ?? null,
                organizationId: organization.id,
            },
        });

        return this.signToken(user.id, user.email, user.role, user.organizationId);
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: {email: dto.email },
        })

        if (!user) {
            throw new UnauthorizedException('Неверный email или пароль')
        }

        const ok = await bcrypt.compare(dto.password, user.passwordHash)
        if (!ok) {
            throw new UnauthorizedException('Неверный email или пароль')
        }

        return this.signToken(user.id, user.email, user.role, user.organizationId)
    }

    private async signToken(
        userId: string,
        email: string,
        role: string,
        organizationId: string | null,
    ) {
        const payload = {
            sub: userId,
            email,
            role,
            organizationId
        }

        const access_token = await this.jwt.signAsync(payload)
        return {access_token};
    }
}
