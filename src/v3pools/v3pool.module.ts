import { DatabaseModule } from 'src/database/database.module';
import { v3PoolProviders } from './v3pool.providers';
import { V3PoolService } from './v3pool.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  providers: [...v3PoolProviders, V3PoolService],
  exports: [V3PoolService],
})
export class V3PoolModule {}
