import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { V3TransactionModule } from './v3transactions/v3transaction.module';

@Module({
  imports: [DatabaseModule, V3TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
