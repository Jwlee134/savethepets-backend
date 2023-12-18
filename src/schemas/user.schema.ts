import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

type PushKey = 'endpoint' | 'p256dh' | 'auth';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  photo: string;

  @Prop(
    raw({
      endpoint: { type: String, default: null },
      p256dh: { type: String, default: null },
      auth: { type: String, default: null },
    }),
  )
  push: Record<PushKey, string>;
}

export const UserSchema = SchemaFactory.createForClass(User);
