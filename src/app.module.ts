import { Module } from "@nestjs/common";
import { ArticlesModule } from "./articles/articles.module";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    ArticlesModule,
    MongooseModule.forRoot("mongodb://mongo/st-premium"),
  ],
})
export class AppModule {}
