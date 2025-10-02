import { MarketType } from '@/modules/market';
import {
	type IGetNewsRequest,
	type IGetNewsResponse,
	type INews,
	type ISegmentRequest,
	Score,
	type SelectAllFrom,
	Sort,
	type SortState,
} from '@/modules/news';
import { getTickersByMarketType } from '@/shared/mock';

type Maybe<T> = T | null | undefined;

export interface ITicker {
	name: string;
	ticker: string;
	srcImage: string;
}

const AUTHORS = [
	'Jesse Cohen', 'Ava Patel', 'Noah Kim', 'Elena García', 'Liam O’Connor', 'Mia Novak', 'Zhang Wei', 'Lucas Moretti',
];

const TITLE_TEMPLATES = [
	'{N} jumps after {X}% {E}, what it means for {S}',
	'Why {N} could outperform {S} through Q4',
	'{N} vs {M}: which is the better {S} play now',
	'3 signals {N} is primed for a breakout',
	'{N} faces headwinds as {E} cools',
	'Analyst note: {N} fair value revised amid {E}',
];

const DESCR_TEMPLATES = [
	'As we move through {Y}, investors weigh earnings momentum against macro risks.',
	'Markets reassess valuation premiums while liquidity rotates across factors.',
	'Positioning remains uneven as dispersion across sectors widens.',
	'Flows suggest growing interest in quality compounders and AI infrastructure.',
];

const SOURCE_IMAGES = ['investing-com.svg', 'benzinga.svg', 'seekingalpha.svg', 'bloomberg.svg'];

function rand(n: number) {
	return Math.floor(Math.random() * n);
}
function pick<T>(arr: T[]): T {
	return arr[rand(arr.length)];
}
function uniq<T>(arr: T[]) {
	return Array.from(new Set(arr));
}

function scoreBandToRange(band: Score): [number, number] {
	if (band === Score.Low) {
		return [0, 33];
	}
	if (band === Score.Medium) {
		return [34, 66];
	}
	return [67, 100];
}

function makeTimestampRecent(daysBack = 21): number {
	const now = Date.now();
	const delta = rand(daysBack * 24 * 60 * 60 * 1000);
	return now - delta;
}

function formatTitle(template: string, names: { N: string; M: string; S: string; X: number; E: string; Y: number }) {
	return template
		.replace('{N}', names.N)
		.replace('{M}', names.M)
		.replace('{S}', names.S)
		.replace('{X}', String(names.X))
		.replace('{E}', names.E)
		.replace('{Y}', String(names.Y));
}

function marketLabel(m: MarketType) {
	switch (m) {
		case MarketType.Crypto: return 'crypto';
		case MarketType.Stock: return 'equities';
		case MarketType.Forex: return 'FX';
		case MarketType.Commodities: return 'commodities';
		case MarketType.Indices: return 'indices';
	}
}

function earningsEventWord() {
	return pick(['earnings beat', 'margin expansion', 'guidance raise', 'valuation reset', 'macro drag']);
}

function selectToMarketTypes(select: SelectAllFrom[]): MarketType[] {
	if (select.includes('all')) {
		return [MarketType.Stock, MarketType.Crypto, MarketType.Forex, MarketType.Commodities, MarketType.Indices];
	}
	const map: Record<Exclude<SelectAllFrom, 'all'>, MarketType> = {
		crypto: MarketType.Crypto,
		stock: MarketType.Stock,
		forex: MarketType.Forex,
		commodity: MarketType.Commodities,
		index: MarketType.Indices,
	};
	const acc: MarketType[] = [];
	for (const s of select) {
		if (s === 'all') {
			continue;
		}
		acc.push(map[s]);
	}
	return uniq(acc);
}

function poolFromSegments(seg: ISegmentRequest): ITicker[] {
	const types = seg.isAllTickersShow
		? [MarketType.Stock, MarketType.Crypto, MarketType.Forex, MarketType.Commodities, MarketType.Indices]
		: selectToMarketTypes(seg.selectAllFrom);

	const pools = types.flatMap(t => getTickersByMarketType(t).map<ITicker>(d => ({
		name: d.right,
		ticker: d.left,
		srcImage: d.left.toLowerCase(),
	})));

	const extra = (seg.selectTickers ?? []).map<ITicker>(t => ({
		name: t,
		ticker: t,
		srcImage: t.toLowerCase(),
	}));

	const merged = uniq([...pools, ...extra].map(x => x.ticker.toUpperCase()));
	const byTicker = new Map<string, ITicker>();
	for (const it of [...pools, ...extra]) {
		const key = it.ticker.toUpperCase();
		if (!byTicker.has(key)) {
			byTicker.set(key, it);
		}
	}
	return merged.map(k => byTicker.get(k)!);
}

function toReadableName(t: ITicker) {
	return t.name || t.ticker;
}

function computeScoreFromBand(bands: Set<Score>): number {
	if (!bands || bands.size === 0) {
		return rand(101);
	}
	const selected = Array.from(bands);
	const [min, max] = scoreBandToRange(pick(selected));
	return min + rand(max - min + 1);
}

function sortByActive(items: INews[], sort: SortState): INews[] {
	if (!sort || sort === Sort.SourcePolarity) {
		return items;
	}
	if (sort === Sort.DateNewest) {
		return [...items].sort((a, b) => b.timestamp - a.timestamp);
	}
	if (sort === Sort.DateOldest) {
		return [...items].sort((a, b) => a.timestamp - b.timestamp);
	}
	if (sort === Sort.Importance) {
		return [...items].sort((a, b) => b.score - a.score);
	}
	return items;
}

function filterByScoreBands(items: INews[], bands: Set<Score>): INews[] {
	if (!bands || bands.size === 0) {
		return items;
	}
	const ranges = Array.from(bands).map(scoreBandToRange);
	return items.filter(n => ranges.some(([lo, hi]) => n.score >= lo && n.score <= hi));
}

function filterBySelectedTickers(items: INews[], selectedTickers: string[]): INews[] {
	if (!selectedTickers || selectedTickers.length === 0) {
		return items;
	}
	const set = new Set(selectedTickers.map(s => s.toUpperCase()));
	return items.filter(n => n.stocks.some(s => set.has(s.ticker.toUpperCase())));
}

function makeId(): string {
	return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

export async function getMockNewsData(req?: Maybe<Partial<IGetNewsRequest>>): Promise<IGetNewsResponse> {
	const offset = req?.offset ?? 0;
	const limit = req?.limit ?? 10;
	const scoreBands = req?.score ?? new Set<Score>();
	const sort = req?.activeSort ?? Sort.DateNewest;
	const selectedTickersGlobal = req?.selectedTickers ?? [];
	const seg: ISegmentRequest = req?.segment ?? { selectAllFrom: ['all'], selectTickers: [], isAllTickersShow: true };

	const universe = poolFromSegments(seg);
	const universeByTicker = new Map(universe.map(u => [u.ticker.toUpperCase(), u]));
	const universeTickers = universe.map(u => u.ticker);

	const marketOfTicker = (t: string): MarketType => {
		const up = t.toUpperCase();
		for (const m of [
			MarketType.Stock,
			MarketType.Crypto,
			MarketType.Forex,
			MarketType.Commodities,
			MarketType.Indices,
		]) {
			const pool = getTickersByMarketType(m);
			if (pool.some(p => p.left.toUpperCase() === up)) {
				return m;
			}
		}
		return MarketType.Stock;
	};

	const basePool: INews[] = Array.from({ length: Math.max(48, limit * 3) }).map(() => {
		const main = pick(universe);
		const altTicker = pick(universeTickers);
		const alt = universeByTicker.get(altTicker.toUpperCase()) ?? main;
		const m = marketOfTicker(main.ticker);

		const title = formatTitle(pick(TITLE_TEMPLATES), {
			N: toReadableName(main),
			M: toReadableName(alt),
			S: marketLabel(m),
			X: 5 + rand(25),
			E: earningsEventWord(),
			Y: new Date().getFullYear(),
		});

		const description = formatTitle(pick(DESCR_TEMPLATES), {
			N: toReadableName(main),
			M: toReadableName(alt),
			S: marketLabel(m),
			X: 10,
			E: earningsEventWord(),
			Y: new Date().getFullYear(),
		});

		const stocks: ITicker[] = uniq([main, alt].map(s => s.ticker.toUpperCase())).map(k => universeByTicker.get(k)!);

		return {
			id: makeId(),
			description,
			timestamp: makeTimestampRecent(21),
			author: pick(AUTHORS),
			title,
			stocks,
			score: computeScoreFromBand(scoreBands),
			srcSourceImage: pick(SOURCE_IMAGES),
		} as INews;
	});

	const filteredBySegTickers =
		seg.isAllTickersShow ||
		seg.selectAllFrom.includes('all') ||
		(seg.selectAllFrom.length === 0
			&& seg.selectTickers.length === 0)
			? basePool
			: basePool.filter(n => n.stocks.some(s => universeByTicker.has(s.ticker.toUpperCase())));

	const byScore = filterByScoreBands(filteredBySegTickers, scoreBands);

	const selectedUnion = uniq([...(req?.segment?.selectTickers ?? []), ...selectedTickersGlobal]);
	const bySelected = filterBySelectedTickers(byScore, selectedUnion);

	const sorted = sortByActive(bySelected, sort);
	const page = sorted.slice(offset, offset + limit);

	await new Promise(r => setTimeout(r, 0));

	return {
		data: page,
		pagination: {
			offset,
			limit,
			total: sorted.length,
		},
	};
}
