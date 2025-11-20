export enum MarketSegmentState {
	CLOSE = 'close',
	OPEN = 'open',
}

export interface IMarketSegment {
	from: number;
	to: number;
	title: string;
	state: MarketSegmentState;
}

export function getMarketSegmentStateColor(state: MarketSegmentState) {
	switch (state) {
		case MarketSegmentState.OPEN:
			return 'var(--contrast-contrast-00, #fff)';
		case MarketSegmentState.CLOSE:
			return 'var(--contrast-contrast-70, rgba(255, 255, 255, 0.30))';
	}
}
