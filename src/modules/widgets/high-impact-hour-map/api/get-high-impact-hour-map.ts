import { add, format } from 'date-fns';

import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/monitoring';
import { delay, randomInt } from '@/shared/lib';
import { type TimeZoneUTC } from '../model';

const IS_USE_MOCK = false;

export interface IGetHighImpactHourMapRequest {
	timezone: TimeZoneUTC;
	widgetId: string;
}

export interface IGetHighImpactHourMapResponse {
	date: string;
	timezone: string;
	now: string;
	nowUtc: string;
	currentHour: number;
	buckets: {
		hour: number;
		lowCount: number;
		mediumCount: number;
		highCount: number;
		eventsCount: number;
		impactScore: number;
	}[];
	totalEventsCount: number;
	maxImpactScore: number;
	nextEvent: {
		datetime: string;
		country: string;
		title: string;
		inHours: number;
		impact: string;
	} | null;
}

export async function getHighImpactHourMap(args: IGetHighImpactHourMapRequest): Promise<IGetHighImpactHourMapResponse> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData(args);
		}

		return await httpService.get<IGetHighImpactHourMapResponse>('/api/v1/high-impact-hour-map/data', {
			query: {
				timezone: args.timezone,
			},
		});
	} catch (error) {
		logger.error('Failed to get High Impact Hour Map data', { error: error as Error });
		throw error;
	}
}

function generateBucket(hour: number) {
	const low = randomInt(0, 5);
	const medium = randomInt(0, 3);
	const high = randomInt(0, 4);

	return {
		hour,
		lowCount: low,
		mediumCount: medium,
		highCount: high,
		eventsCount: low + medium + high,
		impactScore: low + medium * 2 + high * 3,
	};
}

async function getMockData(args: IGetHighImpactHourMapRequest): Promise<IGetHighImpactHourMapResponse> {
	await delay(500);

	const buckets = Array.from({ length: 24 }, (_, i) => generateBucket(i));
	const now = new Date();

	const nextEventDateDiff = randomInt(2, 4);
	const nextEventDate = add(new Date(), { hours: nextEventDateDiff });

	return {
		date: format(now, 'YYYY-MM-DD'),
		timezone: `${args.timezone}:00`,
		now: now.toString(),
		nowUtc: now.toUTCString(),
		currentHour: now.getHours(),
		buckets,
		totalEventsCount: buckets.reduce((acc, bucket) => acc + bucket.eventsCount, 0),
		maxImpactScore: buckets.reduce((acc, bucket) => Math.max(acc, bucket.impactScore), 0),
		nextEvent: {
			datetime: nextEventDate.toJSON(),
			inHours: nextEventDateDiff,
			country: 'US',
			title: 'Core PCE Price Index YoY (Oct)',
			impact: 'High',
		},
	};
}

