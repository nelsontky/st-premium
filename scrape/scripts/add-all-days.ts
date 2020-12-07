import cheerio from "cheerio";
import mongoose from "mongoose";
import { join } from "path";
import { readdirSync, readFileSync, lstatSync } from "fs";

import Article from "../models/Article";
import { MONGO_URI } from "../config/keys";
import { cleanWebsiteText, pairImagesAndCaptions } from "./helpers";
import { IArticle } from "../interfaces";

mongoose
  .connect(MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    let promises: Promise<IArticle>[] = [];

    for (let i = 15; i < 29; i++) {
      const date = "202007" + i;

      const todaysArticlesPath = join(
        __dirname,
        "..",
        "..",
        "www.pressreader.com",
        "singapore",
        "the-straits-times",
        date
      );

      const articlePaths = readdirSync(todaysArticlesPath)
        .map((fileName) => join(todaysArticlesPath, fileName))
        .filter((filePath) => lstatSync(filePath).isFile());

      for (const articlePath of articlePaths) {
        const html = cleanWebsiteText(readFileSync(articlePath, "utf8"));
        const $ = cheerio.load(html);

        const paragraphs: string[] = $("article > p")
          .map((_, e) => $(e).text())
          .get();
        const imageLinks: string[] = $("picture > img")
          .map((_, e) => $(e).attr("src"))
          .get();
        const captions: string[] = $("div > picture ~ p")
          .map((_, e) => cleanWebsiteText($(e).text()))
          .get();

        const imageLinkAndCaptions = pairImagesAndCaptions(
          imageLinks,
          captions
        );

        promises.push(
          new Article({
            date,
            imageLinkAndCaptions,
            paragraphs,
          }).save()
        );
      }
    }

    return Promise.all(promises);
  })
  .then(() => mongoose.connection.close());
