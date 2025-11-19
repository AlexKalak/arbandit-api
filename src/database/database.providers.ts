import { Token, TokenImpact } from 'src/tokens/token.model';
import { V2Pair } from 'src/v2pairs/v2pair.model';
import { V3Pool } from 'src/v3pools/v3pool.model';
import { V3Swap } from 'src/v3swaps/v3swap.model';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '12341234',
        database: 'market_analyze',
        entities: [Token, TokenImpact, V2Pair, V3Pool, V3Swap],
        synchronize: false, // ❌ very important, don’t let TypeORM change schema
      });

      return dataSource.initialize();
    },
  },
];
