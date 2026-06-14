import {ApiProperty} from "@nestjs/swagger";
import {IsDateString, IsInt, IsLatitude, IsLongitude, IsString, Max, Min} from "class-validator";


export class CreateTripDto {
    @ApiProperty({example: 'officeId-1', description: 'Id офиса назначения'})
    @IsString()
    officeId: string;

    @ApiProperty({example: 59.9386, description: 'Широта точки старта'})
    @IsLatitude()
    startLat: number

    @ApiProperty({example: 30.3149967, description: 'Долгота точки старта'})
    @IsLongitude()
    startLng: number

    @ApiProperty({example: 'м. Черная речка, напротив Мака'})
    @IsString()
    startAddress: string;

    @ApiProperty({example: '2026-06-14T07:30:00.000Z', description: 'Время выезда'})
    @IsDateString()
    departureTime: string;

    @ApiProperty({example: 4, description: 'Сколько мест для пассажиров'})
    @IsInt()
    @Min(1)
    @Max(8)
    seatsTotal: number;
}