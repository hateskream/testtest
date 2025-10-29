import { v4 as uuidv4 } from 'uuid';

import { isWidgetTypeKey, WidgetType } from '@/modules/dashboard-group';

export interface IWidgetPreset {
	widgetType: WidgetType;
	name: string;
}

type Preset = Omit<IWidgetPreset, 'widgetType'>;

const FearGreed: Preset = {
	name: 'Fear & Greed',
};

const Market: Preset = {
	name: 'Market',
};

const Price: Preset = {
	name: 'Price',
};

const News: Preset = {
	name: 'News',
};

const Watchlist: Preset = {
	name: 'Watchlist',
};

const Performance: Preset = {
	name: 'Performance',
};

const MarketCap: Preset = {
	name: 'MarketCap',
};

const AltcoinSeason: Preset = {
	name: 'Altcoin Season',
};

const BitcoinDominance: Preset = {
	name: 'Dominance',
};

const TopIndices: Preset = {
	name: 'Top Indices YTD',
};

const Calendar: Preset = {
	name: 'Calendar',
};

const Heatmap: Preset = {
	name: 'Heatmap',
};

const ChartPrice: Preset = {
	name: 'Chart',
};

const Exchange: Preset = {
	name: 'Exchange',
};


const EthGas: Preset = {
	name: 'ETH Gas',
};

const presets: Record<WidgetType, Preset> = {
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

function createPreset(widgetType: WidgetType): IWidgetPreset {
	const preset = presets[widgetType];

	return {
		...preset,
		widgetType,
	};
}

export interface IWidget extends IWidgetPreset {
	height: number;
	defaultStateType: string;
	id: string;
}

export function createWidget(widgetType: WidgetType, height: number, defaultStateType = ''): IWidget {
	const preset = createPreset(widgetType);

	return {
		...preset,
		height,
		id: uuidv4(),
		defaultStateType,
	};
}

export function rehydrateWidget(
	id: string,
	widgetType: string,
	height: number,
	defaultStateType: string,
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
		defaultStateType,
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
