import type { IGetHighImpactHourMapResponse } from '../api';
import { getDateFormatter } from '@/shared/lib';

export type EventImpactLevel = 'High' | 'Low' | 'Medium';

export interface IEvent {
	datetime: string;
	country: string;
	title: string;
	inHours: number;
	impact: EventImpactLevel;
}

export interface ITimelineHour {
	hour: number;
	highEventsCount: number;
	impactLevel: number;
	active: boolean;
}

export interface IHighImpactHourMapDomain {
	hours: ITimelineHour[];
	date: string;
	currentHour: number;
	timezone: string;
	nextEvent: IEvent | null;
}

export function mapHighImpactHourMap(
	dto: IGetHighImpactHourMapResponse,
): IHighImpactHourMapDomain {
	const totalHighEventsCount = dto.buckets.reduce((acc, bucket) => acc + bucket.highCount, 0);
	const formatter = getDateFormatter({
		timeZone: dto.timezone.replace('UTC', ''),
		hour: '2-digit',
		hourCycle: 'h23',
	});

	const hour = formatter.format(new Date(dto.now));

	return {
		date: dto.date,
		timezone: dto.timezone,
		hours: dto.buckets.map(bucket => ({
			hour: bucket.hour,
			highEventsCount: bucket.highCount,
			impactLevel: totalHighEventsCount > 0 ? bucket.highCount / totalHighEventsCount : 0,
			active: bucket.hour.toString() === hour,
		})),
		currentHour: dto.currentHour,
		nextEvent: dto.nextEvent ? {
			datetime: dto.nextEvent.datetime,
			country: dto.nextEvent.country,
			title: dto.nextEvent.title,
			inHours: dto.nextEvent.inHours,
			impact: dto.nextEvent.impact as EventImpactLevel,
		} : null,
	};
}

