export interface IMarketCapCurrency {
	id: string;
	name: string;
	symbol: string;
	change24h: number;
	color: string;
	fdv: string;
	type: 'stock' | 'crypto';
}
