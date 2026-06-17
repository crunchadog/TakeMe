import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsLatitude, IsLongitude, IsOptional, IsString } from 'class-validator';

export class UpdateMeDto {
    @ApiPropertyOptional()
    @IsOptional() @IsString()
    name?: string;

    @ApiPropertyOptional()
    @IsOptional() @IsString()
    city?: string;

    @ApiPropertyOptional()
    @IsOptional() @IsString()
    homeAddress?: string;

    @ApiPropertyOptional()
    @IsOptional() @IsLatitude()
    homeLat?: number;

    @ApiPropertyOptional()
    @IsOptional() @IsLongitude()
    homeLng?: number;

    @ApiPropertyOptional()
    @IsOptional() @IsString()
    avatarColor?: string;
}