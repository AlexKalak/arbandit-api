import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
  ArbsOnChainResponse,
  ArbsOnChainRequest,
} from 'src/grpc/proto/arbitrage';
import { Arbitrage, ArbitragePathUnit } from './arbitrage.model';
import { firstValueFrom, Observable } from 'rxjs';

interface ArbitrageGrpcService {
  GetArbsOnChain(data: ArbsOnChainRequest): Observable<ArbsOnChainResponse>;
}

@Injectable()
export class ArbitrageService implements OnModuleInit {
  private arbitrageGrpcService: ArbitrageGrpcService;
  constructor(
    @Inject('ARBITRAGE_GRPC') private arbitrageGrpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.arbitrageGrpcService =
      this.arbitrageGrpcClient.getService<ArbitrageGrpcService>('arbitrage');
  }

  async GetOnChainArbs(chainID: number): Promise<Arbitrage[]> {
    const respObs = this.arbitrageGrpcService.GetArbsOnChain({
      chainId: chainID,
    });

    const resp = await firstValueFrom(respObs);

    const arbitrages: Arbitrage[] = [];

    if (!resp.arbitrages) {
      console.log('arbitrages', resp.arbitrages);
      return [];
    }

    for (const responseArb of resp.arbitrages) {
      const arbitrage: Arbitrage = {
        path: [],
      };
      for (const responseArbPathUnit of responseArb.path) {
        console.log('path unit:', responseArbPathUnit);
        const pathUnit: ArbitragePathUnit = {
          poolAddress: responseArbPathUnit.poolAddress,
          tokenInAddress: responseArbPathUnit.tokenInAddress,
          tokenOutAddress: responseArbPathUnit.tokenOutAddress,
          amountIn: responseArbPathUnit.amountIn,
          amountOut: responseArbPathUnit.amountOut,
        };
        arbitrage.path.push(pathUnit);
      }
      arbitrages.push(arbitrage);
    }

    return arbitrages;
  }
}
