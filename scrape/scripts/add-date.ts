// Usage
// tsc -p tsconfig.json && node out/scripts/add-date.js 20201214

import cheerio from "cheerio";
import mongoose from "mongoose";
import { execSync } from "child_process";
import { join } from "path";
import { readdirSync, readFileSync, lstatSync } from "fs";

import Article from "../models/Article";
import { IArticle } from "../interfaces";
import { MONGO_URI } from "../config/keys";
import {
  cleanWebsiteText,
  delay,
  pairImagesAndCaptions,
} from "./helpers";

async function addTodaysArticlesToDb(date: string) {
  await mongoose.connect(MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  let promises: Promise<IArticle>[] = [];

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
    const imageLinkAndCaptions = pairImagesAndCaptions(imageLinks, captions);

    promises.push(
      new Article({
        date,
        imageLinkAndCaptions,
        paragraphs,
      }).save()
    );
  }

  await Promise.all(promises);
  return await mongoose.connection.close();
}

async function downloadTodaysArticles(date: string) {
  while (true) {
    try {
      execSync(
        `wget -U "Googlebot-News" -r -l 1 https://www.pressreader.com/singapore/the-straits-times/${date}`
      );
      return;
    } catch (e) {
      if (e.message.includes("Is a directory")) {
        // Terminate if articles were already downloaded
        return;
      }
      await delay(1000 * 60); // Try again every 60 seconds
    }
  }
}

if (process.argv.length > 2) {
  (async () => {
    const date = process.argv[2];

    const todaysArticlesPath = join(
      __dirname,
      "..",
      "..",
      "www.pressreader.com",
      "singapore",
      "the-straits-times",
      date
    );

    try {
      execSync(`rm -rf ${todaysArticlesPath}`);
    } catch (e) {
      console.log(e);
      // Do nothing if folder does not exist
    }

    console.log(`Downloading started at ${new Date().toString()}`);
    await downloadTodaysArticles(date);
    await addTodaysArticlesToDb(date);
    console.log(`Downloaded and added to db at ${new Date().toString()}`);
  })();
}
