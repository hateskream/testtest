interface IRangeData {
	min: number;
	max: number;
	current: number;
	start: number;
	symbol: string;
}

export interface IRangeLineProps {
	data: Record<string, IRangeData>;
	modelValue?: string;
}
