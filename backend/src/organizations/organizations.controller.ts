import {Body, Controller, Delete, Get, Param, Post, Query} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import {CurrentUser} from "../auth/decorators/current-user.decorator";

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
    constructor(private organizationsService: OrganizationsService) {}

    @Get()
    findAll(@CurrentUser('organizationId') orgId: string) {
        return this.organizationsService.findAll(orgId);
    }

    @Get('cities')
    getCities(@Query('token') token: string) {
        return this.organizationsService.getCitiesByToken(token);
    }

    @Post()
    create(@Body() dto: CreateOrganizationDto) {
        return this.organizationsService.create(dto);
    }

    @Delete(':id')
    delete(@Param('id') orgId: string) {
        return this.organizationsService.remove(orgId);
    }
}