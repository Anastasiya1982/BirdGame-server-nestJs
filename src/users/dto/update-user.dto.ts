import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
    @ApiProperty({ required: false })
    name: string;

    @ApiProperty({ required: false })
    email: string;

    @ApiProperty({
        required: false,
    })
    id: string;

    @ApiProperty({ required: false })
    password: string;
}
