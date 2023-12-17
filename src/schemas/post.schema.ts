import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author: User;

  @Prop({ required: true })
  type: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  species: number;

  @Prop({ required: true })
  breed: number;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop({ required: true })
  contact: string;

  @Prop({ required: true })
  sex: number;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  photos: string[];

  @Prop({ required: true })
  time: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
