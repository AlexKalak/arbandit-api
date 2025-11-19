import { Module } from '@nestjs/common';
import { ArbitrageService } from './arbitrage.service';
import { GrpcClientsModule } from 'src/grpc/grpcClients.module';

@Module({
  imports: [GrpcClientsModule],
  providers: [ArbitrageService],
  exports: [ArbitrageService, GrpcClientsModule],
})
export class ArbitrageModule { }
