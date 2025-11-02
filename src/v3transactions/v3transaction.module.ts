import { DatabaseModule } from 'src/database/database.module';
import { v3TransactionProviders } from './v3transaction.providers';
import { V3TransactionService } from './v3transaction.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  providers: [...v3TransactionProviders, V3TransactionService],
  exports: [V3TransactionService],
})
export class V3TransactionModule {}
