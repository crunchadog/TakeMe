import {Body, Controller, Get, Patch, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {UsersService} from "./users.service";
import {CurrentUser} from "../auth/decorators/current-user.decorator";
import {UpdateMeDto} from "./dto/create-me.dto";

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('me')
    getMe(@CurrentUser('id') userId: string) {
        return this.usersService.getMe(userId);
    }

    @Patch('me')
    updateMe(@CurrentUser('id') userId: string, @Body() dto: UpdateMeDto) {
        return this.usersService.updateMe(userId, dto);
    }
}
