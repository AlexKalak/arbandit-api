import { DataSource } from 'typeorm';
import { V3Pool } from './v3pool.model';

export const v3PoolProviders = [
  {
    provide: 'V3_POOL_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(V3Pool),
    inject: ['DATA_SOURCE'],
  },
];
