import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ default: '' })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  password: string;
  @Prop({required:false})
  id: string;


  @Prop({ default: false })
  isActivated: boolean;

  @Prop()
  activationLink: string;

  @Prop()
  avatar: string;

  @Prop({ default: null })
  avatarId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
