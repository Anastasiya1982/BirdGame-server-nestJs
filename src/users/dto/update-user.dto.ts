export class UpdateUserDto {
  name: string;
  email: string;
  id: string;
  isActivated: boolean;
  activationLink: string;

  readonly password: string;
}
