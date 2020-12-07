import mongoose, { Schema } from "mongoose";

import { IArticle } from "../interfaces";

const ArticleSchema = new Schema({
  pathname: { type: String, index: true },
  date: { type: String, required: true, index: true }, // yyymmdd
  imageLinkAndCaptions: {
    type: [{ imageLink: String, caption: String }],
    required: true,
  },
  paragraphs: { type: [String], required: true },
});

export default mongoose.model<IArticle>("articles", ArticleSchema);
