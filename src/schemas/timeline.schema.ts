import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Post } from './post.schema';

export type TimelineDocument = HydratedDocument<Timeline>;

@Schema({ timestamps: true })
export class Timeline {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  missingPost: Post;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  sightingPost: Post;

  @Prop({ default: false })
  confirmed: boolean;
}

export const TimelineSchema = SchemaFactory.createForClass(Timeline);
