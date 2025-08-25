export interface ITickerState {
	isShowLogo: boolean;
	isShowTicker: boolean;
	isShowDescription: boolean;
}

export function getDefaultTickerState(): ITickerState {
	return {
		isShowLogo: true,
		isShowTicker: true,
		isShowDescription: false,
	};
}

export function toggleShowLogo(state: ITickerState): ITickerState {
	return {
		...state,
		isShowLogo: !state.isShowLogo,
	};
}

export function changeTextDisplay(state: ITickerState): ITickerState {
	const isShowTicker = !state.isShowTicker;
	const isShowDescription = !state.isShowDescription;

	return {
		...state,
		isShowTicker,
		isShowDescription,
	};
}
