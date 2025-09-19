import { EventType, Impact, MarketIds } from '../../models';
import type {
	ICalendarEvent,
	ICalendarEventMetric,
	ICreateEventBoardOptions,
	IEventBoard,
	IEventBoardFilters,
} from '../../types';

export function createMockEventBoard(
	options: ICreateEventBoardOptions,
): IEventBoard[] {
	const { range, filters } = options;

	assertYmd(range.from);
	assertYmd(range.to);

	const start = new Date(range.from + 'T00:00:00Z');
	const end = new Date(range.to + 'T00:00:00Z');
	if (start > end) {
		throw new Error('`from` must be <= `to`');
	}

	const rng = mulberry32(hashStr(range.from + ':' + range.to));
	const types = Object.values(EventType).filter(
		(v) => v !== EventType.All,
	) as EventType[];
	const tickers = [
		'AAPL',
		'TSLA',
		'NVDA',
		'MSFT',
		'AMZN',
		'GOOGL',
		'META',
		'AMD',
		'NFLX',
		'BABA',
	] as const;
	const crypto = ['BTC', 'ETH', 'SOL', 'RAI', 'TON', 'DOGE'] as const;

	const out: IEventBoard[] = [];
	for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
		const date = toYmd(d);
		const count = randInt(rng, 0, 4);

		const events: ICalendarEvent[] = Array.from({ length: count }, () => {
			const eventType = pick(rng, types);
			const isStock = eventType !== EventType.Crypto && rng() < 0.8;
			const baseTitle = isStock ? pick(rng, tickers) : pick(rng, crypto);
			const eventTitle =
				eventType === EventType.Crypto
					? baseTitle
					: `${baseTitle} ${
						eventType === EventType.Earnings ? 'Earnings Report' : eventType
					}`;
			const eventTitleDescription =
				eventType === EventType.Crypto && rng() < 0.5
					? 'Unlock'
					: eventType === EventType.Dividends && rng() < 0.5
						? 'Quarterly'
						: undefined;

			const time = `${pad2(randInt(rng, 8, 18))}:${pad2(randInt(rng, 0, 59))}`;
			const eventDatetime = `${date}T${time}`;

			const metrics = makeMetrics(rng, eventType, date);
			const ticker = isStock ? (baseTitle as string) : undefined;

			const marketId = chooseMarketId(rng, eventType, ticker);
			const impact = chooseImpact(rng, eventType, metrics);

			return {
				eventType,
				eventTitle,
				eventTitleDescription,
				eventDatetime,
				metrics,
				ticker,
				link: '',
				linkText: 'Details',
				marketId,
				impact,
			};
		});

		out.push({ date, events });
	}

	return applyFilters(out, filters);

	function makeMetrics(
		r: () => number,
		t: EventType,
		ymd: string,
	): ICalendarEventMetric[] {
		if (t === EventType.Splits) {
			const a = randInt(r, 1, 3),
				b = randInt(r, 2, 10);
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
				{
					label: 'Quarter',
					value: `Q${randInt(r, 1, 4)} ${randInt(r, 2019, 2025)}`,
				},
				{ label: 'Revenue', value: `${randFloat(r, 0.1, 200).toFixed(2)} B` },
			];
		}
		if (t === EventType.News) {
			return [
				{
					label: 'Sentiment',
					value: pick(r, ['Positive', 'Neutral', 'Negative'] as const),
				},
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
}

function applyFilters(
	days: IEventBoard[],
	filters?: Partial<IEventBoardFilters>,
): IEventBoard[] {
	if (!filters) {
		return days;
	}
	const byType = (e: ICalendarEvent) =>
		!filters.eventType ||
		filters.eventType === EventType.All ||
		e.eventType === filters.eventType;
	const byImpact = (e: ICalendarEvent) =>
		!filters.impact ||
		filters.impact === Impact.All ||
		e.impact === filters.impact;
	const byMarket = (e: ICalendarEvent) =>
		filters.marketId === undefined || e.marketId === filters.marketId;

	return days
		.map((d) => ({
			date: d.date,
			events: d.events.filter((e) => byType(e) && byImpact(e) && byMarket(e)),
		}))
		.filter((d) => d.events.length > 0);
}

function chooseMarketId(
	r: () => number,
	t: EventType,
	ticker?: string,
): MarketIds {
	const stockMarket: Record<string, MarketIds> = {
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
	if (ticker && stockMarket[ticker]) {
		return stockMarket[ticker];
	}
	if (t === EventType.Crypto) {
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

function chooseImpact(
	r: () => number,
	t: EventType,
	metrics: ICalendarEventMetric[],
): Impact {
	const num = (s: string | undefined) => {
		if (!s) {
			return null;
		}
		const m = /-?\d+(\.\d+)?/.exec(s);
		return m ? parseFloat(m[0]) : null;
	};

	if (t === EventType.Ipos) {
		const v = num(metrics.find((m) => m.label === 'IPO Value')?.value) ?? 0;
		if (v >= 50) {
			return Impact.High;
		}
		if (v >= 10) {
			return Impact.Medium;
		}
		return Impact.Low;
	}
	if (t === EventType.Dividends) {
		const y = num(metrics.find((m) => m.label === 'Div. yield')?.value) ?? 0;
		if (y >= 4) {
			return Impact.High;
		}
		if (y >= 2) {
			return Impact.Medium;
		}
		return Impact.Low;
	}
	if (t === EventType.Earnings) {
		const eps = Math.abs(num(metrics.find((m) => m.label === 'EPS')?.value) ?? 0);
		if (eps >= 2) {
			return Impact.High;
		}
		if (eps >= 0.5) {
			return Impact.Medium;
		}
		return Impact.Low;
	}
	if (t === EventType.Economic) {
		const a = num(metrics.find((m) => m.label === 'Actual')?.value) ?? 0;
		const f = num(metrics.find((m) => m.label === 'Forecast')?.value) ?? 0;
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
		const amt = num(metrics.find((m) => m.label === 'Amount')?.value) ?? 0;
		if (amt >= 1.5) {
			return Impact.High;
		}
		if (amt >= 0.3) {
			return Impact.Medium;
		}
		return Impact.Low;
	}
	if (t === EventType.Revenue) {
		const rev = num(metrics.find((m) => m.label === 'Revenue')?.value) ?? 0;
		if (rev >= 80) {
			return Impact.High;
		}
		if (rev >= 20) {
			return Impact.Medium;
		}
		return Impact.Low;
	}
	if (t === EventType.Splits) {
		const ratio = metrics.find((m) => m.label === 'Ratio')?.value ?? '';
		const [, bStr] = ratio.split(':');
		const b = Number(bStr ?? '1');
		if (b >= 8) {
			return Impact.High;
		}
		if (b >= 4) {
			return Impact.Medium;
		}
		return Impact.Low;
	}
	if (t === EventType.News) {
		const s = metrics.find((m) => m.label === 'Sentiment')?.value ?? 'Neutral';
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

function assertYmd(s: string): void {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) {
		throw new Error('Expected YYYY-MM-DD');
	}
}

function toYmd(d: Date): string {
	return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number): Date {
	const x = new Date(d);
	x.setUTCDate(x.getUTCDate() + n);
	return x;
}

function shiftYmd(ymd: string, deltaDays: number): string {
	const d = new Date(ymd + 'T00:00:00Z');
	d.setUTCDate(d.getUTCDate() + deltaDays);
	return toYmd(d);
}

function toPretty(ymd: string): string {
	const d = new Date(ymd + 'T00:00:00Z');
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	}).format(d);
}

function pad2(n: number): string {
	return n < 10 ? '0' + n : String(n);
}

function randInt(r: () => number, min: number, max: number): number {
	return Math.floor(r() * (max - min + 1)) + min;
}

function randFloat(r: () => number, min: number, max: number): number {
	return r() * (max - min) + min;
}

function pick<T>(r: () => number, arr: readonly T[]): T {
	return arr[Math.floor(r() * arr.length)];
}

function hashStr(s: string): number {
	let h = 2166136261 >>> 0;
	for (let i = 0; i < s.length; i += 1) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}

function mulberry32(seed: number): () => number {
	return function () {

		// eslint-disable-next-line no-param-reassign
		let t = (seed += 0x6d2b79f5);
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
