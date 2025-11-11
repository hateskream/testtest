import { v4 as uuidv4 } from 'uuid';

import { isWidgetTypeKey, WidgetType } from '@/modules/dashboard-group';

export type DisplayVariant = 'chart' | 'tile' | 'bar' | 'list' | 'default';

export interface IWidgetPreset {
	widgetType: WidgetType;
	displayVariants: DisplayVariant[];
	name: string;
}

type Preset = Omit<IWidgetPreset, 'widgetType'>;

const ChartPrice: Preset = {
	name: 'Price',
	displayVariants: ['chart', 'tile'],
};

const TopIndices: Preset = {
	name: 'Top Indices YTD',
	displayVariants: ['list'],
};

const Performance: Preset = {
	name: 'Performance',
	displayVariants: ['bar', 'list'],
};

const MarketCap: Preset = {
	name: 'Market cap',
	displayVariants: ['chart', 'tile'],
};

const BitcoinDominance: Preset = {
	name: 'Dominance',
	displayVariants: ['chart', 'tile', 'bar'],
};

const Price: Preset = {
	name: 'Price list',
	displayVariants: ['list'],
};

const News: Preset = {
	name: 'News',
	displayVariants: ['default'],
};

const Calendar: Preset = {
	name: 'Calendar',
	displayVariants: ['default'],
};

const FearGreed: Preset = {
	name: 'Fear & Greed',
	displayVariants: ['default'],
};

const Market: Preset = {
	name: 'Market',
	displayVariants: ['default'],
};

const Watchlist: Preset = {
	name: 'Watchlist',
	displayVariants: ['default'],
};

const AltcoinSeason: Preset = {
	name: 'Altcoin Season',
	displayVariants: ['default'],
};

const Heatmap: Preset = {
	name: 'Heatmap',
	displayVariants: ['default'],
};

const Exchange: Preset = {
	name: 'Exchange',
	displayVariants: ['default'],
};

const EthGas: Preset = {
	name: 'ETH Gas',
	displayVariants: ['default'],
};

const presets: Partial<Record<WidgetType, Preset>> = {
	[WidgetType.FearGreed]: FearGreed,
	[WidgetType.Market]: Market,
	[WidgetType.Price]: Price,
	[WidgetType.News]: News,
	[WidgetType.Watchlist]: Watchlist,
	[WidgetType.Performance]: Performance,
	[WidgetType.MarketCap]: MarketCap,
	[WidgetType.AltcoinSeason]: AltcoinSeason,
	[WidgetType.BitcoinDominance]: BitcoinDominance,
	[WidgetType.TopIndices]: TopIndices,
	[WidgetType.Calendar]: Calendar,
	[WidgetType.Heatmap]: Heatmap,
	[WidgetType.ChartPrice]: ChartPrice,
	[WidgetType.Exchange]: Exchange,
	[WidgetType.EthGas]: EthGas,
};

function createPreset(widgetType: WidgetType): IWidgetPreset | null {
	const preset = presets[widgetType];
	if (!preset) {
		return null;
	}

	return {
		...preset,
		widgetType,
	};
}

export interface IWidget extends IWidgetPreset {
	height: number;
	displayVariant: DisplayVariant;
	defaultStateType: string;
	maxCountRow?: number;
	id: string;
}

export function createWidget(
	widgetType: WidgetType,
	height: number,
	displayVariant: DisplayVariant,
	defaultStateType = '',
	maxCountRow?: number,
) : IWidget | null {
	const preset = createPreset(widgetType);
	if (!preset) {
		// eslint-disable-next-line no-console
		console.error(`Preset not found for widget type: ${widgetType}`);
		return null;
	}

	return {
		...preset,
		height,
		id: uuidv4(),
		defaultStateType,
		displayVariant,
		maxCountRow,
	};
}

export function rehydrateWidget(
	id: string,
	widgetType: string,
	height: number,
	displayVariant: DisplayVariant,
	defaultStateType: string,
	maxCountRow?: number,
): IWidget | null {
	if (isWidgetTypeKey(widgetType) === false) {
		// eslint-disable-next-line no-console
		console.error(`Invalid widget type: ${widgetType}`);
		return null;
	}

	const preset = createPreset(widgetType);
	if (!preset) {
		// eslint-disable-next-line no-console
		console.error(`Preset not found for widget type: ${widgetType}`);
		return null;
	}

	return {
		...preset,
		id,
		height,
		displayVariant,
		defaultStateType,
		maxCountRow,
	};
}

export function calcSizeSideGridCell(
	side: number,
	minSize: number,
	maxSize: number,
): { count: number; size: number } {
	let bestSize = minSize;
	let bestCount = Math.floor(side / minSize);
	let minRemainder = side % minSize;

	// eslint-disable-next-line no-plusplus
	for (let i = minSize; i <= maxSize; i++) {
		const count = Math.floor(side / i);
		const remainder = side % i;

		if (
			remainder < minRemainder ||
      (remainder === minRemainder && i > bestSize)
		) {
			bestSize = i;
			bestCount = count;
			minRemainder = remainder;
		}
	}

	return {
		count: bestCount,
		size: bestSize,
	};
}
