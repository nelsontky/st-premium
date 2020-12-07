import { Controller, Get, Query } from "@nestjs/common";
import { ArticlesService } from "./articles.service";

@Controller()
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  findOne(
    @Query("pathname")
    pathname: string
  ) {
    return this.articlesService.findArticle(pathname);
  }
}
