import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({required:false})
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({
    required:false
  })
  id: string;

  @ApiProperty({required:false})
  isActivated: boolean;

  @ApiProperty({required:false})
  password: string;

  @ApiProperty({required:false})
  activationLink: string;
}
