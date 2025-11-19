import { DataSource } from 'typeorm';
import { V3Swap } from './v3swap.model';

export const v3SwapProviders = [
  {
    provide: 'V3_SWAP_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(V3Swap),
    inject: ['DATA_SOURCE'],
  },
];
