import { DatabaseModule } from 'src/database/database.module';
import { tokenProviders } from './token.providers';
import { TokenService } from './token.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  providers: [...tokenProviders, TokenService],
  exports: [TokenService],
})
export class TokenModule {}
