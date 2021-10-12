export class CreateUserDto {
  name: string;
  email: string;
  id?: string;
  isActivated: boolean;
  password: string;
  activationLink: string;
}
