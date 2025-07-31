export interface IBitcoinDominancCurrency {
	id: string;
	name: string;
	symbol: string;
	changeYerstaday: number;
	changeWeek: number;
	changeYear: number;
	color: string;
	dominanc: number;
	type: 'stock' | 'crypto';
}
