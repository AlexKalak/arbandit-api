import { DataSource } from 'typeorm';
import { V2Pair } from './v2pair.model';

export const v2PairProviders = [
  {
    provide: 'V2_PAIR_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(V2Pair),
    inject: ['DATA_SOURCE'],
  },
];
