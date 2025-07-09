export interface ICurrency {
	market: string;
	srcImage: string | string[];
	ticker: string;
	name: string;
	price: string;
	changeLastDay: string;
	marketCap: string;
	domain?: string;
}
