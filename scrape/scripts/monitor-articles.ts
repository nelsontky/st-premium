import cheerio from "cheerio";
import mongoose from "mongoose";
import { CronJob } from "cron";
import { execSync } from "child_process";
import { join } from "path";
import { readdirSync, readFileSync, lstatSync } from "fs";

import Article from "../models/Article";
import { CRON_PATTERN, SG_TIMEZONE_OFFSET } from "../config/config";
import { IArticle } from "../interfaces";
import { MONGO_URI } from "../config/keys";
import {
  cleanWebsiteText,
  delay,
  getSgDate,
  pairImagesAndCaptions,
} from "./helpers";

async function addTodaysArticlesToDb() {
  await mongoose.connect(MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const date = getSgDate();

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

async function downloadTodaysArticles() {
  while (true) {
    try {
      execSync(
        `wget -U "Googlebot-News" -r -l 1 https://www.pressreader.com/singapore/the-straits-times/${getSgDate()}`
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

const job = new CronJob({
  cronTime: CRON_PATTERN,
  utcOffset: SG_TIMEZONE_OFFSET,
  onTick: async () => {
    console.log(`Downloading started at ${new Date().toString()}`);
    await downloadTodaysArticles();
    await addTodaysArticlesToDb();
    console.log(`Downloaded and added to db at ${new Date().toString()}`);
  },
});

job.start();
console.log("Job started");
