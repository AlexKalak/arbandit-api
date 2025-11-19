import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ARBITRAGE_GRPC',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:50001',
          package: 'arbitrage',
          protoPath: 'src/grpc/proto/arbitrage.proto',
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcClientsModule {}
