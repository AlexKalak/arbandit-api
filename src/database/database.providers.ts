import { Token } from 'src/tokens/token.model';
import { V2Pair } from 'src/v2pairs/v2pair.model';
import { V3Pool } from 'src/v3pools/v3pool.model';
import { V3Transaction } from 'src/v3transactions/v3transaction.model';
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
        entities: [Token, V2Pair, V3Pool, V3Transaction],
        synchronize: false, // ❌ very important, don’t let TypeORM change schema
      });

      return dataSource.initialize();
    },
  },
];
