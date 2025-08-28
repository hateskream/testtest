export interface ITicker {
	ticker: string;
	name: string;
	srcImage: string;
}

export interface INews {
	id: string;
	description: string;
	timestamp: number;
	author: string;
	title: string;
	stocks: ITicker[];
	score: number;
	srcSourceImage: string;
}
