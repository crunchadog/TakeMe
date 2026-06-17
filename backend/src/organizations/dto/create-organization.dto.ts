import {IsEmail, IsOptional, IsString, Matches, MinLength} from "class-validator";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class CreateOrganizationDto {
    @ApiProperty({example: 'Моя Компания'})
    @IsString()
    @MinLength(2)
    organizationName: string

    @ApiPropertyOptional({
        description: 'Свой токен или оставьте пустым для генерации'
    })
    @IsOptional()
    @IsString()
    @Matches(/^[A-Za-z0-9-]+$/, { message: 'Токен: только буквы, цифры и дефис' })
    inviteToken?: string

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    password: string;

    @ApiPropertyOptional()
    @IsString()
    city: string;
}