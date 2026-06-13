import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {CurrentUser} from "../auth/decorators/current-user.decorator";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {RolesGuard} from "../auth/guards/roles.guard";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {OfficesService} from "./offices.service";
import {Roles} from "../auth/decorators/roles.decorator";
import {CreateOfficeDto} from "./dto/create-office.dto";
import {UpdateOfficeDto} from "./dto/update-office.dto";

@ApiTags("offices")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('offices')
export class OfficesController {
    constructor(private officeService: OfficesService) {
    }

    @Get()
    findAll(@CurrentUser('organizationId') orgId: string) {
        return this.officeService.findAll(orgId);
    }

    @Get(':id')
    findOne(
        @CurrentUser('organizationId') orgId: string,
        @Param("id") id: string
    ) {
        return this.officeService.findOne(orgId, id);
    }

    @Roles('ADMIN')
    @Post()
    create(@CurrentUser("organizationId") orgId: string,
           @Body() dto: CreateOfficeDto,
    ) {
        return this.officeService.create(orgId, dto);
    }

    @Roles("ADMIN")
    @Patch(':id')
    update(@CurrentUser("organizationId") orgId: string,
           @Param("id") id: string,
           @Body() dto: UpdateOfficeDto,
    ) {
        return this.officeService.update(orgId, id, dto);
    }

    @Roles("ADMIN")
    @Delete(":id")
    remove(@CurrentUser("organizationId") orgId: string,
           @Param("id") id: string
    ) {
        return this.officeService.remove(orgId, id);
    }

    @Get('debug')
    debug(@CurrentUser() user: any) {
        return user;
    }
}
