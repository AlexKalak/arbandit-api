import { DataSource } from 'typeorm';
import { V3Transaction } from './v3transaction.model';

export const v3TransactionProviders = [
  {
    provide: 'V3_TRANSACTION_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(V3Transaction),
    inject: ['DATA_SOURCE'],
  },
];
