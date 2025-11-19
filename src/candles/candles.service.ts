import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/redis/redis.providers';
import { Candle } from './candle.model';
import { V3SwapService } from 'src/v3swaps/v3swap.service';
import { V3PoolService } from 'src/v3pools/v3pool.service';
import { randomUUID } from 'crypto';

const getPrice = (
  chartForToken: number,
  token0UsdPrice: number,
  token1UsdPrice: number,
  amount0Real: number,
  amount1Real: number,
) => {
  const tokenPrice =
    chartForToken == 0
      ? token1UsdPrice * Math.abs(amount1Real / amount0Real)
      : token0UsdPrice * Math.abs(amount0Real / amount1Real);

  return tokenPrice;
};

type CandlesServiceFindProps = {
  timeSpacing: number; //in seconds
  poolAddress: string;
  chainID: number;
  chartForToken: number;
};

@Injectable()
export class CandlesService {
  constructor(
    private swapService: V3SwapService,
    private v3poolService: V3PoolService,
    private eventEmitter: EventEmitter2,

    @Inject(REDIS_CLIENT)
    private redisProvider: Redis,
  ) {}

  async findForV3Pool({
    poolAddress,
    chainID,
    chartForToken,
    timeSpacing,
  }: CandlesServiceFindProps): Promise<Candle[]> {
    const pool = await this.v3poolService.findByAddress(poolAddress, chainID);
    if (!pool) {
      return [];
    }

    const token0 = await pool.token0;
    if (!token0) {
      return [];
    }
    const token1 = await pool.token1;
    if (!token1) {
      return [];
    }

    const swaps = await this.swapService.find({
      first: 1000,
      skip: chartForToken,
      fromHead: true,
      where: {
        poolAddress,
        chainId: chainID,
      },
    });
    swaps.reverse();

    const candles: Candle[] = [];
    let lastTimeStamp = 0;
    let lastPrice = 0;

    for (const swap of swaps) {
      const realAmount0 = token0.getRealAmountOfToken(swap.amount0);
      const realAmount1 = token1.getRealAmountOfToken(swap.amount1);

      const price = getPrice(
        chartForToken,
        swap.archiveToken0UsdPrice,
        swap.archiveToken1UsdPrice,
        realAmount0,
        realAmount1,
      );
      if (price === 0 || price === -Infinity || price === +Infinity) {
        continue;
      }

      const flooredTxTimestamp =
        swap.txTimestamp - (swap.txTimestamp % timeSpacing);

      //New canlde
      if (flooredTxTimestamp - lastTimeStamp >= timeSpacing) {
        if (lastTimeStamp !== 0) {
          const diff = flooredTxTimestamp - lastTimeStamp;
          const amountOfEmptyCandles = Math.floor(diff / timeSpacing) - 1;

          for (let i = 0; i < amountOfEmptyCandles; i++) {
            candles.push({
              uuid: randomUUID().toString(),
              open: lastPrice,
              close: lastPrice,
              high: lastPrice,
              low: lastPrice,
              timestamp: lastTimeStamp + (i + 1) * timeSpacing,
              amountSwaps: 0,
            });
          }
        }
        lastTimeStamp = flooredTxTimestamp;

        candles.push({
          uuid: randomUUID().toString(),
          open: lastPrice !== 0 ? lastPrice : price,
          close: price,
          high: price,
          low: price,
          timestamp: flooredTxTimestamp,
          amountSwaps: 1,
        });
        //Update existing candle
      } else {
        const candle = candles[candles.length - 1];

        candle.close = price;
        candle.amountSwaps++;

        if (price < candle.low) {
          candle.low = price;
        }
        if (price > candle.high) {
          candle.high = price;
        }
        candle.close = price;
      }
      lastPrice = price;
    }

    return candles;
  }
}
