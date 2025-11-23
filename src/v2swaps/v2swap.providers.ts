import { DataSource } from 'typeorm';
import { V2Swap } from './v2swap.model';

export const v2SwapProviders = [
  {
    provide: 'V2_SWAP_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(V2Swap),
    inject: ['DATA_SOURCE'],
  },
];
