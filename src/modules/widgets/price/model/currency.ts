export interface ICurrency {
	id: string;
	market: string;
	srcImage: string | string[];
	ticker: string;
	name: string;
	price: string;
	changeLastDay: string;
	marketCap: string;
	domain?: string;
}
