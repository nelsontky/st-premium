import { Document } from "mongoose";

export interface ImageLinkAndCaption {
  imageLink: string | null;
  caption: string | null;
}

export interface IArticle extends Document {
  pathname?: string;
  date: string; // yyymmdd
  imageLinkAndCaptions: ImageLinkAndCaption[];
  paragraphs: string[];
}
