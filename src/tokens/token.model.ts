import { Column, Entity, Index } from 'typeorm';

@Index('tokens_pkey', ['address'], { unique: true })
@Entity('tokens', { schema: 'public' })
export class Token {
  @Column('integer', { name: 'chain_id', nullable: true })
  chainId: number | null;

  @Column('integer', { name: 'decimals', nullable: true })
  decimals: number | null;

  @Column('character varying', { name: 'name', nullable: true })
  name: string | null;

  @Column('character varying', { name: 'symbol', nullable: true })
  symbol: string | null;

  @Column('character varying', { primary: true, name: 'address' })
  address: string;

  @Column('text', { name: 'logo_uri', nullable: true })
  logoUri: string | null;

  @Column('numeric', { name: 'defi_scaled_usd_price' })
  defiScaledUsdPrice: string;
}
