import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ArticleDocument = Article & Document;

@Schema()
export class Article {
  @Prop({ index: true })
  pathname: string;

  @Prop({ index: true, required: true })
  date: string; // yyyymmdd

  @Prop({ required: true })
  imageAndLinkCaptions: { imageLink: string; caption: string }[];

  @Prop({ required: true })
  paragraphs: string[];
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
