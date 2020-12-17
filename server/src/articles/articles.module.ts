import { Module } from "@nestjs/common";
import { ArticlesController } from "./articles.controller";
import { ArticlesService } from "./articles.service";
import { Article, ArticleSchema } from "./article.schema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [MongooseModule.forFeature([{name: Article.name, schema: ArticleSchema}])],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
