import { EventType, type ICreateEventBoardOptions } from '@/modules/calendar';
import type { ICalendarEvent, ICalendarEventMetric, IEventBoard } from '../../types';

export function createMockEventBoard(
	options: ICreateEventBoardOptions,
) {
	const { from, to } = options;

	assertYmd(from);
	assertYmd(to);

	const start = new Date(from + 'T00:00:00Z');
	const end = new Date(to + 'T00:00:00Z');
	if (start > end) {
		throw new Error('`from` must be <= `to`');
	}

	const rng = mulberry32(hashStr(from + ':' + to));
	const types = (Object.values(EventType).filter(v => v !== EventType.All) as EventType[]);
	const tickers = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN', 'GOOGL', 'META', 'AMD', 'NFLX', 'BABA'] as const;
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
					: `${baseTitle} ${eventType === EventType.Earnings ? 'Earnings Report' : eventType}`;
			const eventTitleDescription =
				eventType === EventType.Crypto && rng() < 0.5
					? 'Unlock'
					: eventType === EventType.Dividends && rng() < 0.5
						? 'Quarterly'
						: undefined;

			const time = `${pad2(randInt(rng, 8, 18))}:${pad2(randInt(rng, 0, 59))}`;
			const eventDatetime = `${date}T${time}`;

			const metrics = makeMetrics(rng, eventType, date);
			const ticker = isStock ? baseTitle : undefined;

			return {
				eventType,
				eventTitle,
				eventTitleDescription,
				eventDatetime,
				metrics,
				ticker,
				link: '',
				linkText: 'Details',
			};
		});

		out.push({ date, events });
	}

	return out;

	function makeMetrics(r: () => number, t: EventType, ymd: string): ICalendarEventMetric[] {
		if (t === EventType.Splits) {
			const a = randInt(r, 1, 3), b = randInt(r, 2, 10);
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
			return [{ label: 'Sentiment', value: pick(r, ['Positive', 'Neutral', 'Negative'] as const) }];
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

function assertYmd(s: string) {
	return !/^\d{4}-\d{2}-\d{2}$/.test(s);
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
	return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(d);
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
