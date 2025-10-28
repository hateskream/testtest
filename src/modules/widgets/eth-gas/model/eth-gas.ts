export interface IGasCardData {
	type: 'slow' | 'standard' | 'fast';
	gwei: number;
	time: number;
	price: number;
}
export interface IGasStatsData {
	lastBlock: number;
	avgBlockSize: number;
	pendingQueue: number;
	avgUtilization: number;
}
