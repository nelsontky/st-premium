import { Article, ArticleDocument } from "./article.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import axios from "axios";
import * as cheerio from "cheerio";
import Fuse from "fuse.js";

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>
  ) {}

  async findArticle(pathname: string) {
    const {
      headline,
      date,
      previewText,
      imageLinkAndCaption,
    } = await getArticleInfo(pathname);

    const existing = await this.articleModel.find({ pathname }).exec();
    if (existing.length > 0) {
      return {
        headline,
        paragraphs: existing[0].paragraphs,
        imageLinkAndCaption,
      };
    }

    const tomorrow = new Date(date.getTime() + 24 * 60 * 60 * 1000);
    const yesterday = new Date(date.getTime() - 24 * 60 * 60 * 1000);

    // Articles from one day ago to one day later
    const articles = await this.articleModel
      .find({
        date: { $in: [yesterday, date, tomorrow].map(formatDate) },
      })
      .exec();

    const joinedParagraphs = articles.map((article) =>
      article.paragraphs.slice(0, 4).join(" ")
    );

    const fuse = new Fuse(joinedParagraphs, {
      isCaseSensitive: false,
      includeScore: true,
      ignoreFieldNorm: true,
      ignoreLocation: true,
    });

    const searchResult = fuse
      .search(previewText, { limit: 1 })
      .filter((result) => result.score < 0.5);

    const result = articles[searchResult[0].refIndex];

    result.pathname = pathname;
    await result.save();

    return {
      headline,
      paragraphs: result.paragraphs,
      imageLinkAndCaption,
    };
  }
}

async function getArticleInfo(
  pathname: string
): Promise<{
  headline: string;
  date: Date;
  previewText: string;
  imageLinkAndCaption: { imageLink: string; caption: string };
}> {
  const html = (await axios.get("https://straitstimes.com" + pathname)).data;
  const $ = cheerio.load(html);

  const headline = $("h1.headline").text();
  const date = parseDateText($("li.story-postdate").text());
  const previewText = $("div.field-item > p")
    .map(function () {
      return $(this).text();
    })
    .get()
    .join(" ");
  const imageLink = $("picture > img").attr("src");
  const caption = $("figure > figcaption").text();

  return {
    headline,
    date,
    previewText,
    imageLinkAndCaption: { imageLink, caption },
  };
}

function parseDateText(dateText: string): Date {
  if (dateText.includes("hours ago")) {
    return new Date();
  }

  const datePieces = dateText.slice(9).split(", ");
  return new Date(datePieces[0] + " " + datePieces[1]);
}

function formatDate(date: Date): string {
  let month = "" + (date.getMonth() + 1);
  let day = "" + date.getDate();
  let year = date.getFullYear();

  if (month.length < 2) {
    month = "0" + month;
  }
  if (day.length < 2) {
    day = "0" + day;
  }

  return [year, month, day].join("");
}
