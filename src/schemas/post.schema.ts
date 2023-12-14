import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: User;

  @Prop()
  type: number;

  @Prop()
  description: string;

  @Prop()
  species: number;

  @Prop()
  breed: number;

  @Prop()
  latitude: number;

  @Prop()
  longitude: number;

  @Prop()
  contact: number;

  @Prop()
  sex: number;

  @Prop()
  address: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
