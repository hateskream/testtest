import type {
	ICalendarEvent,
	ICalendarEventMetric,
	IEventBoardFilters,
	IEventBoardRequestOptions,
	IEventBoardResponse,
} from '../../models';
import { EventType, Impact, MarketIds } from '../../models';
import { allTickers } from '@/shared/mock';
import { SymbolType } from '@/modules/cell';
import { addDays } from '@/modules/calendar';

type RNG = () => number;

const STOCK_LEFT = allTickers[SymbolType.Stock];
const CRYPTO_LEFT = allTickers[SymbolType.Crypto];
const INDEX_LEFT = allTickers[SymbolType.Index];
const COMMO_LEFT = allTickers[SymbolType.Commodity];
const FOREX_PAIRS = allTickers[SymbolType.Forex];

export function createMockEventBoard(
	options: IEventBoardRequestOptions,
): IEventBoardResponse[] {
	const { range, filters } = options;

	const start = ymdToUtcDate(range.from);
	const end = ymdToUtcDate(range.to);

	const rng = mulberry32(hashStr(`${range.from}:${range.to}`));
	const eventTypes = Object.values(EventType).filter((t) => t !== EventType.All) as EventType[];

	const days: IEventBoardResponse[] = [];

	for (let date = new Date(start); date <= end; date = addDays(date, 1)) {
		const ymd = toYmd(date);
		const count = randInt(rng, 0, 100);

		const events: ICalendarEvent[] = Array.from({ length: count }, (_, index) => {
			const eventType = pick(rng, eventTypes);

			const { symbolType, ticker, additional, baseTitle } = createTicker(rng, eventType);

			const eventTitle = createEventTitle(baseTitle, eventType);
			const eventTitleDescription = createEventTitleDescription(rng, eventType);
			const eventDatetime = `${ymd}T${timeHHMM(rng)}`;
			const metrics = createMetrics(rng, eventType, ymd);

			const marketId = createMarketIdFromTicker(rng, eventType, symbolType, ticker);
			const impact = createImpact(rng, eventType, metrics);

			return {
				id: date.toString() + index.toString(),
				ticker,
				additional,
				symbolType,
				eventType,
				eventTitle,
				eventTitleDescription,
				eventDatetime,
				metrics,
				section: symbolType,
				link: '',
				linkText: 'Details',
				marketId,
				impact,
			};
		});

		days.push({ date: ymd, events });
	}

	return applyFilters(days, filters);
}

function splitLegacyCode(raw: string) {
	const i = raw.indexOf('-');

	const sectionStr = raw.slice(0, i).trim() as SymbolType;
	const rest = raw.slice(i + 1).trim();
	const list = allTickers[sectionStr];

	if (sectionStr === SymbolType.Forex) {
		const pairs = list.map(x => x.left + x.right);
		pairs.sort((a, b) => b.length - a.length);

		const hit = pairs.find(p => rest.startsWith(p));
		if (!hit) {
			return null;
		}

		const right = rest.slice(hit.length).trim() || undefined;

		return { section: sectionStr, left: hit, right };
	}

	const candidates = list.map(x => x.left).sort((a, b) => b.length - a.length);
	const hit = candidates.find(t => rest.startsWith(t));

	if (!hit) {
		return null;
	}

	const right = rest.slice(hit.length).trim() || undefined;
	return { section: sectionStr, left: hit, right };
}

function applyFilters(
	days: IEventBoardResponse[],
	filters?: Partial<IEventBoardFilters>,
) {
	if (!filters) {
		return days;
	}

	const byType = (e: ICalendarEvent) =>
		!filters.eventType || filters.eventType === EventType.All || e.eventType === filters.eventType;

	const byImpact = (e: ICalendarEvent) =>
		!filters.impact || filters.impact === Impact.All || e.impact === filters.impact;

	const byMarket = (e: ICalendarEvent) =>
		filters.marketId === undefined || filters.marketId === MarketIds.EntireWorld || e.marketId === filters.marketId;

	const byWatchlist = (e: ICalendarEvent) => {
		const wl = filters.watchlist;
		if (!wl || wl.length === 0) {
			return true;
		}

		for (const raw of wl) {
			const p = splitLegacyCode(raw);
			if (!p) {
				continue;
			}
			if (p.section !== e.section) {
				continue;
			}
			if (e.ticker === p.left) {
				return true;
			}
		}
		return false;
	};

	return days
		.map(d => ({
			date: d.date,
			events: d.events.filter(e => byType(e) && byImpact(e) && byMarket(e) && byWatchlist(e)),
		}))
		.filter(d => d.events.length > 0);
}

function createTicker(r: RNG, et: EventType) {
	if (et === EventType.Crypto) {
		const t = pick(r, CRYPTO_LEFT);
		return { symbolType: SymbolType.Crypto, ticker: t.left, baseTitle: t.right, additional: t.right };
	}
	const roll = r();

	if (roll < 0.70) {
		const t = pick(r, STOCK_LEFT);
		return { symbolType: SymbolType.Stock, ticker: t.left, baseTitle: t.right, additional: t.right };
	}
	if (roll < 0.85) {
		const t = pick(r, INDEX_LEFT);
		return { symbolType: SymbolType.Index, ticker: t.left, baseTitle: t.right, additional: t.right };
	}
	if (roll < 0.95) {
		const t = pick(r, COMMO_LEFT);
		return { symbolType: SymbolType.Commodity, ticker: t.left, baseTitle: t.right, additional: t.right };
	}

	const p = pick(r, FOREX_PAIRS);

	return { symbolType: SymbolType.Forex, ticker: p.left, baseTitle: p.left + p.right, additional: p.right };
}

function createMarketIdFromTicker(
	r: RNG,
	t: EventType,
	s: SymbolType,
	ticker: string,
): MarketIds {
	if (s === SymbolType.Crypto || t === EventType.Crypto) {
		return MarketIds.EntireWorld;
	}

	const STOCK_MARKET: Record<string, MarketIds> = {
		AAPL: MarketIds.USA,
		TSLA: MarketIds.USA,
		NVDA: MarketIds.USA,
		MSFT: MarketIds.USA,
		AMZN: MarketIds.USA,
		GOOGL: MarketIds.USA,
		META: MarketIds.USA,
		AMD: MarketIds.USA,
		NFLX: MarketIds.USA,
		BABA: MarketIds.HongKong,
	};

	if (s === SymbolType.Stock && STOCK_MARKET[ticker]) {
		return STOCK_MARKET[ticker];
	}

	if (s === SymbolType.Forex) {
		return MarketIds.EntireWorld;
	}

	const pool = [
		MarketIds.USA,
		MarketIds.India,
		MarketIds.Germany,
		MarketIds.Japan,
		MarketIds.Canada,
		MarketIds.HongKong,
		MarketIds.UnitedKingdom,
		MarketIds.EntireWorld,
	] as const;

	return pick(r, pool);
}

function createEventTitle(base: string, type: EventType) {
	if (type === EventType.Crypto) {
		return base;
	}
	const suffix = type === EventType.Earnings ? 'Earnings Report' : type;

	return `${base} ${suffix}`;
}

function createEventTitleDescription(rng: RNG, type: EventType) {
	if (type === EventType.Crypto) {
		return rng() < 0.5 ? 'Unlock' : undefined;
	}
	if (type === EventType.Dividends) {
		return rng() < 0.5 ? 'Quarterly' : undefined;
	}

	return undefined;
}

function createMetrics(r: RNG, t: EventType, ymd: string): ICalendarEventMetric[] {
	if (t === EventType.Splits) {
		const a = randInt(r, 1, 3);
		const b = randInt(r, 2, 10);
		return [{ label: 'Ratio', value: `${a}:${b}` }];
	}
	if (t === EventType.Ipos) {
		return [
			{ label: 'IPO Value', value: `${randFloat(r, 0.5, 300).toFixed(2)} B` },
			{ label: 'IPO Price', value: randFloat(r, 3, 120).toFixed(2) },
			{ label: 'Last Price', value: randFloat(r, 3, 120).toFixed(2) },
		];
	}
	if (t === EventType.Dividends) {
		const ex = shiftYmd(ymd, -randInt(r, 1, 5));
		const pay = shiftYmd(ymd, randInt(r, 5, 15));
		return [
			{ label: 'Amount', value: `$${randFloat(r, 0.01, 3).toFixed(2)}` },
			{ label: 'Ex-date', value: toPretty(ex) },
			{ label: 'Pay date', value: toPretty(pay) },
			{ label: 'Div. yield', value: `${randFloat(r, 0.1, 8).toFixed(2)}%` },
		];
	}
	if (t === EventType.Earnings) {
		return [
			{ label: 'EPS', value: randFloat(r, -1, 8).toFixed(2) },
			{ label: 'Rev.', value: `${randFloat(r, 0.1, 200).toFixed(2)} B` },
			{ label: 'Guide', value: r() < 0.5 ? 'Up' : 'Down' },
		];
	}
	if (t === EventType.Economic) {
		return [
			{ label: 'Actual', value: randFloat(r, -5, 10).toFixed(2) },
			{ label: 'Forecast', value: randFloat(r, -5, 10).toFixed(2) },
			{ label: 'Previous', value: randFloat(r, -5, 10).toFixed(2) },
		];
	}
	if (t === EventType.Crypto) {
		return [
			{ label: 'Amount', value: `$${randFloat(r, 0.01, 5).toFixed(2)}` },
			{ label: 'Unlock %', value: `${randFloat(r, 0.5, 25).toFixed(2)}%` },
		];
	}
	if (t === EventType.Revenue) {
		return [
			{ label: 'Quarter', value: `Q${randInt(r, 1, 4)} ${randInt(r, 2019, 2025)}` },
			{ label: 'Revenue', value: `${randFloat(r, 0.1, 200).toFixed(2)} B` },
		];
	}
	if (t === EventType.News) {
		return [
			{ label: 'Sentiment', value: pick(r, ['Positive', 'Neutral', 'Negative'] as const) },
		];
	}
	if (t === EventType.Conference) {
		return [
			{ label: 'Speaker', value: pick(r, ['CEO', 'CFO', 'CTO'] as const) },
			{ label: 'Venue', value: pick(r, ['Virtual', 'NYC', 'London', 'Tokyo'] as const) },
		];
	}

	return [];
}

function createImpact(r: RNG, t: EventType, m: ICalendarEventMetric[]): Impact {
	const num = (s?: string) => {
		if (!s) {
			return null;
		}
		const match = /-?\d+(\.\d+)?/.exec(s);
		return match ? parseFloat(match[0]) : null;
	};

	if (t === EventType.Ipos) {
		const v = num(m.find((x) => x.label === 'IPO Value')?.value) ?? 0;
		if (v >= 50) {
			return Impact.High;
		}
		if (v >= 10) {
			return Impact.Medium;
		}
		return Impact.Low;
	}

	if (t === EventType.Dividends) {
		const y = num(m.find((x) => x.label === 'Div. yield')?.value) ?? 0;
		if (y >= 4) {
			return Impact.High;
		}
		if (y >= 2) {
			return Impact.Medium;
		}
		return Impact.Low;
	}

	if (t === EventType.Earnings) {
		const eps = Math.abs(num(m.find((x) => x.label === 'EPS')?.value) ?? 0);
		if (eps >= 2) {
			return Impact.High;
		}
		if (eps >= 0.5) {
			return Impact.Medium;
		}
		return Impact.Low;
	}

	if (t === EventType.Economic) {
		const a = num(m.find((x) => x.label === 'Actual')?.value) ?? 0;
		const f = num(m.find((x) => x.label === 'Forecast')?.value) ?? 0;
		const diff = Math.abs(a - f);
		if (diff >= 2.5) {
			return Impact.High;
		}
		if (diff >= 1) {
			return Impact.Medium;
		}
		return Impact.Low;
	}

	if (t === EventType.Crypto) {
		const amt = num(m.find((x) => x.label === 'Amount')?.value) ?? 0;
		if (amt >= 1.5) {
			return Impact.High;
		}
		if (amt >= 0.3) {
			return Impact.Medium;
		}
		return Impact.Low;
	}

	if (t === EventType.Revenue) {
		const rev = num(m.find((x) => x.label === 'Revenue')?.value) ?? 0;
		if (rev >= 80) {
			return Impact.High;
		}
		if (rev >= 20) {
			return Impact.Medium;
		}
		return Impact.Low;
	}

	if (t === EventType.Splits) {
		const ratio = m.find((x) => x.label === 'Ratio')?.value ?? '';
		const [, bStr] = ratio.split(':');
		const b = Number(bStr || '1');
		if (b >= 8) {
			return Impact.High;
		}
		if (b >= 4) {
			return Impact.Medium;
		}
		return Impact.Low;
	}

	if (t === EventType.News) {
		const s = m.find((x) => x.label === 'Sentiment')?.value ?? 'Neutral';
		if (s === 'Negative') {
			return r() < 0.6 ? Impact.High : Impact.Medium;
		}
		if (s === 'Positive') {
			return Impact.Medium;
		}
		return Impact.Low;
	}

	if (t === EventType.Conference) {
		return r() < 0.2 ? Impact.High : r() < 0.6 ? Impact.Medium : Impact.Low;
	}

	return Impact.Low;
}

// date
function ymdToUtcDate(ymd: string): Date {
	return new Date(`${ymd}T00:00:00Z`);
}

function toYmd(d: Date): string {
	return d.toISOString().slice(0, 10);
}

function shiftYmd(ymd: string, deltaDays: number): string {
	const d = ymdToUtcDate(ymd);
	d.setUTCDate(d.getUTCDate() + deltaDays);
	return toYmd(d);
}

function toPretty(ymd: string): string {
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	}).format(ymdToUtcDate(ymd));
}

function timeHHMM(r: RNG): string {
	return `${pad2(randInt(r, 8, 23))}:${pad2(randInt(r, 0, 59))}`;
}

function pad2(n: number): string {
	return String(n).padStart(2, '0');
}

// random
function randInt(r: RNG, min: number, max: number): number {
	return Math.floor(r() * (max - min + 1)) + min;
}

function randFloat(r: RNG, min: number, max: number): number {
	return r() * (max - min) + min;
}

function pick<T>(r: RNG, arr: readonly T[]): T {
	return arr[Math.floor(r() * arr.length)];
}

function hashStr(s: string): number {
	let h = 2166136261 >>> 0;
	for (let i = 0; i < s.length; i+=1) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}

function mulberry32(seed: number): RNG {
	return function () {
		// eslint-disable-next-line no-param-reassign
		let t = (seed += 0x6d2b79f5);
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
