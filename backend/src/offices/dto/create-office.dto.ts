import {ApiProperty} from "@nestjs/swagger";
import {IsLatitude, IsLongitude, IsString, MinLength} from "class-validator";


export class CreateOfficeDto {
    @ApiProperty({example: "Главный офис"})
    @IsString()
    @MinLength(1)
    name: string;

    @ApiProperty({example: 'Ул. Уличная'})
    @IsString()
    address: string;

    @ApiProperty({example: 'Санкт-Петербург'})
    @IsString()
    city: string;

    @ApiProperty({example: 59.9386})
    @IsLatitude()
    lat: number
    @ApiProperty({example: 30.3149967})
    @IsLongitude()
    lng: number
}