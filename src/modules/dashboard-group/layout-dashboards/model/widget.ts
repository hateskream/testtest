import { v4 as uuidv4 } from 'uuid';
import { match, P } from 'ts-pattern';

import { isWidgetTypeKey, WidgetType } from '@/modules/dashboard-group';

export type DisplayVariant = 'chart' | 'tile' | 'bar' | 'list' | 'default';

export interface IWidgetPreset {
	widgetType: WidgetType;
	displayVariants: DisplayVariant[];
	name: string;
	snapStep?: number;
	/*
		нужно для того чтобы работали виджеты calendar/top indices
		сейчас в нем есть двойной скролл и дата, ее высота как раз и задается в этом поле

		без этого не получится корректно обрезать высоту виджета чтобы не было перекрытых карточек
	*/
	otherHeight?: number;
	hasFilters?: boolean;
	minHeight?: number;
	maxHeight?: number;
}

type Preset = Omit<IWidgetPreset, 'widgetType'>;

const ChartPrice: Preset = {
	name: 'Price',
	displayVariants: ['chart', 'tile'],
	minHeight: 400,
};

const TopIndices: Preset = {
	name: 'Top Indices YTD',
	displayVariants: ['list'],
	otherHeight: 24,
	snapStep: 36,
};

const Performance: Preset = {
	name: 'Performance',
	displayVariants: ['bar', 'list'],
};

const MarketCap: Preset = {
	name: 'Market cap',
	displayVariants: ['chart', 'tile'],
	minHeight: 206,
	maxHeight: 406,
};

const BitcoinDominance: Preset = {
	name: 'Dominance',
	displayVariants: ['chart', 'tile', 'bar'],
};

const Price: Preset = {
	name: 'Price list',
	displayVariants: ['list'],
	snapStep: 68,
	hasFilters: true,
};

const News: Preset = {
	name: 'News',
	displayVariants: ['default'],
};

const Calendar: Preset = {
	name: 'Calendar',
	displayVariants: ['default'],
	otherHeight: 36,
	snapStep: 36,
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

const ConsumerPriceIndex: Preset = {
	name: 'Consumer price index',
	displayVariants: ['default'],
};

const NonfarmPayrolls: Preset = {
	name: 'Nonfarm Payrolls (1Y)',
	displayVariants: ['default'],
	minHeight: 186,
	maxHeight: 384,
};

const NominalGDP: Preset = {
	name: 'Nominal gross domestic product',
	displayVariants: ['default'],
};

const RealGDP: Preset = {
	name: 'Real gross domestic product',
	displayVariants: ['default'],
};

const UnemploymentRate: Preset = {
	name: 'Unemployment Rate (1Y)',
	displayVariants: ['default'],
	minHeight: 186,
	maxHeight: 384,
};

const NewsSummary: Preset = {
	name: 'News Summary',
	displayVariants: ['default'],
};

const HighImpactHourMap: Preset = {
	name: 'High Impact Hour Map (Today) ',
	displayVariants: ['default'],
};

const UsInflation: Preset = {
	name: 'US Inflation (1Y)',
	displayVariants: ['default'],
};

const FederalFunds: Preset = {
	name: 'Federal funds',
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
	[WidgetType.ConsumerPriceIndex]: ConsumerPriceIndex,
	[WidgetType.NonfarmPayrolls]: NonfarmPayrolls,
	[WidgetType.NominalGDP]: NominalGDP,
	[WidgetType.UnemploymentRate]: UnemploymentRate,
	[WidgetType.RealGDP]: RealGDP,
	[WidgetType.NewsSummary]: NewsSummary,
	[WidgetType.HighImpactHourMap]: HighImpactHourMap,
	[WidgetType.UsInflation]: UsInflation,
	[WidgetType.FederalFunds]: FederalFunds,
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
	id: string;
	height: number;
	displayVariant: DisplayVariant;
	defaultStateType: string;
	hasFilters: boolean;
	stateType?: string;
	maxCountRow?: number;
}

const titleWidgetHeight = (widget: IWidget) => widget.hasFilters ? 76 : 40;

const CAN_CHANGE_HEIGHT = P.union(
	WidgetType.TopIndices,
	WidgetType.Performance,
	WidgetType.MarketCap,
	WidgetType.Price,
	WidgetType.News,
	WidgetType.UnemploymentRate,
	WidgetType.NonfarmPayrolls,
	WidgetType.Calendar,
);

export function canChangeHeight(widget: IWidget): boolean {
	return match(widget)
		.with({ widgetType: WidgetType.ChartPrice, displayVariant: 'chart' }, () => true)
		.with({ widgetType: CAN_CHANGE_HEIGHT }, () => true)
		.otherwise(() => false);
}

export function createWidget(
	widgetType: WidgetType,
	height: number,
	displayVariant: DisplayVariant,
	defaultStateType = '',
	stateType = '',
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
		stateType,
		id: uuidv4(),
		defaultStateType,
		displayVariant,
		maxCountRow,
		hasFilters: preset.hasFilters ?? false,
	};
}

export function changeMaxCountRow(
	widget: IWidget,
	maxCountRow: number,
): IWidget {
	return {
		...widget,
		maxCountRow,
	};
}

export function changeHeight(
	widget: IWidget,
	height: number,
): IWidget {
	return {
		...widget,
		height,
	};
}

export function getMinHeight(widget: IWidget) {
	const { snapStep = 0, minHeight, otherHeight = 0 } = widget;

	return minHeight ?? titleWidgetHeight(widget) + snapStep + otherHeight;
}

export function calcMaxCountRowVisible(widget: IWidget, widgetHeight: number) {
	const { snapStep = 1, otherHeight = 0 } = widget;

	return Math.floor((widgetHeight - titleWidgetHeight(widget) - otherHeight) / snapStep);
}

export function findMovedWidget(
	prevWidgets: IWidget[],
	nextWidgets: IWidget[],
): IWidget | null {
	const prevIndexById = prevWidgets.reduce<Record<string, number>>(
		(acc, w, i) => ({ ...acc, [w.id]: i }),
		{},
	);

	return (
		nextWidgets.find(
			(widget, index) =>
				prevIndexById[widget.id] !== undefined &&
				prevIndexById[widget.id] !== index,
		) ?? null
	);
}

export function findNewWidget(
	prevWidgets: IWidget[],
	nextWidgets: IWidget[],
): IWidget | null {
	const prevIds = new Set(prevWidgets.map(w => w.id));

	return nextWidgets.find(widget => !prevIds.has(widget.id)) ?? null;
}


export function snapHeightToNearestStep(widget: IWidget, height: number) {
	const { snapStep, otherHeight = 0 } = widget;
	if (!snapStep) {
		return ;
	}

	const newHeightContent = height - titleWidgetHeight(widget) - otherHeight;

	const remainder = newHeightContent % snapStep;

	let snappedHeightContent;

	if (remainder >= snapStep / 2) {
		snappedHeightContent = Math.ceil(newHeightContent / snapStep) * snapStep;
	} else {
		snappedHeightContent = Math.floor(newHeightContent / snapStep) * snapStep;
	}

	return snappedHeightContent + titleWidgetHeight(widget) + otherHeight;
}

export function fromInfiniteToFinite(widget: IWidget, targetHeight: number): IWidget {
	const height = snapHeightToNearestStep(widget, targetHeight);
	if (!height) {
		return widget;
	}

	const maxCountRow = calcMaxCountRowVisible(widget, height);

	return {
		...widget,
		height,
		maxCountRow,
	};
}


export function rehydrateWidget(
	id: string,
	widgetType: string,
	height: number,
	displayVariant: DisplayVariant,
	defaultStateType: string,
	stateType = '',
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
		stateType,
		maxCountRow,
		hasFilters: preset.hasFilters ?? false,
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
