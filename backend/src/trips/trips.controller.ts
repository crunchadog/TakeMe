import {Body, Controller, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {CurrentUser} from "../auth/decorators/current-user.decorator";
import {CreateTripDto} from "./dto/create-trip.dto";
import {TripsService} from "./trips.service";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";

@ApiTags('trips')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('trips')
export class TripsController {
    constructor(private tripsService: TripsService) {
    }

    @Post()
    create(@CurrentUser("id") userId: string,
           @CurrentUser('organizationId') orgId: string,
           @Body() dto: CreateTripDto
    ) {
        return this.tripsService.create(userId, orgId, dto);
    }

    @Get()
    findAll(@CurrentUser('organizationId') orgId: string) {
        return this.tripsService.findAll(orgId);
    }

    @Get(":id")
    findOne(@CurrentUser('organizationId') orgId: string,
            @Param('id') id: string
    ) {
        return this.tripsService.findOne(orgId, id)
    }

    @Post(':id/join')
    join(@CurrentUser('id') userId: string,
         @CurrentUser('organizationId') orgId: string,
         @Param('id') id: string
    ) {
        return this.tripsService.join(userId, orgId, id)
    }

    @Patch(':id/leave')
    leave(@CurrentUser('id') userId: string,
          @CurrentUser('organizationId') orgId: string,
          @Param('id') id: string
    ) {
        return this.tripsService.leave(userId, orgId, id)
    }

    @Patch(':id/cancel')
    cancel(
        @CurrentUser('id') userId: string,
        @CurrentUser('organizationId') orgId: string,
        @Param('id') id: string,
    ) {
        return this.tripsService.cancel(userId, orgId, id)
    }
}
