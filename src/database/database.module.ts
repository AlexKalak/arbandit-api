import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { GqlWhereParsingService } from './gqlWhereParsing.service';

@Module({
  providers: [...databaseProviders, GqlWhereParsingService],
  exports: [...databaseProviders, GqlWhereParsingService],
})
export class DatabaseModule {}
