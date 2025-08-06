export interface IBitcoinDominanceCurrency {
	id: string;
	name: string;
	symbol: string;
	changeYerstaday: number;
	changeWeek: number;
	changeYear: number;
	color: string;
	dominance: number;
	type: 'stock' | 'crypto';
}
