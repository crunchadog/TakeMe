import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString, MinLength} from "class-validator";

export class RegisterDto {
    @ApiProperty({example: 'bobrishov.job@gmail.com'})
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'Kirill' })
    @IsString()
    name: string;

    @ApiProperty({minLength: 6})
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({example: "COMP-TOKEN-1024", description: "Токен организации"})
    @IsString()
    organizationToken: string;
}