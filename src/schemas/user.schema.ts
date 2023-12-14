import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  photo: string;

  @Prop(raw({ endpoint: String, p256dh: String, auth: String }))
  push: Record<string, string>;
}

export const UserSchema = SchemaFactory.createForClass(User);
