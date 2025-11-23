import { DatabaseModule } from 'src/database/database.module';
import { Module } from '@nestjs/common';
import { v2PairProviders } from './v2pair.providers';
import { V2PairService } from './v2pair.service';

@Module({
  imports: [DatabaseModule],
  providers: [...v2PairProviders, V2PairService],
  exports: [V2PairService],
})
export class V2PairModule {}
