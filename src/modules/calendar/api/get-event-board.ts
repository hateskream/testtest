import { z } from 'zod';

import {
	type IEventBoardRequest,
	type IEventBoardResponse,
	type ICalendarEventBadge,
	type CalendarCountryIdsType,
	type CalendarImpactType,
	CalendarCategory,
	CalendarCountryIds,
	CalendarImpact,
	COUNTRY_TO_ISO,
} from '../model/calendar';
import { useLogger } from '@/shared/service/monitoring';
import { useApiClient } from '@/shared/service/api';
import { getMockEventBoard } from './mock/event-board';

const IS_USE_MOCK = false;

const CalendarEventBadgeColorSchema = z.enum(['negative', 'neutral', 'positive']).or(
	z.string().startsWith('#'),
);

const CalendarEventBadgeSchema = z.object({
	label: z.string(),
	color: CalendarEventBadgeColorSchema,
});

const CalendarEventMetricSchema = z.object({
	label: z.string(),
	value: z.string(),
});

const CalendarEventDetailsSchema = z.object({
	label: z.string(),
	link: z.string(),
});

const CalendarEventSchema = z.object({
	id: z.string(),
	meta: z.object({
		title: z.string(),
		description: z.string(),
		datetime: z.string(),
		image: z.string(),
		category: z.nativeEnum(CalendarCategory),
		country: z.nativeEnum(CalendarCountryIds).or(z.string().min(2)),
		impact: z.nativeEnum(CalendarImpact).or(z.enum(['Low', 'Medium', 'High'])),
		badge: CalendarEventBadgeSchema.optional(),
	}),
	canonical_ticker_id: z.string(),
	metrics: z.array(CalendarEventMetricSchema),
	details: CalendarEventDetailsSchema.optional(),
});

const EventBoardItemSchema = z.object({
	date: z.string(),
	events: z.array(CalendarEventSchema),
});

export const GetEventBoardResponseSchema = z.object({
	days: z.array(EventBoardItemSchema).nonempty(),
});

export type GetEventBoardResponse = z.infer<typeof GetEventBoardResponseSchema>;

export async function getEventBoard(request: IEventBoardRequest): Promise<IEventBoardResponse> {
	try {
		const response = IS_USE_MOCK
			? GetEventBoardResponseSchema.parse(await getMockEventBoard())
			: await getApiEventBoard(request);

		return mapEventBoardResponseToModel(response);
	} catch (error) {
		const logger = useLogger();
		logger.error('Failed to get event board', {
			error: error as Error,
		});
		throw error;
	}
}

function getApiEventBoard(options: IEventBoardRequest) {
	const client = useApiClient();

	return client.get('/api/v1/calendar/data', GetEventBoardResponseSchema, {
		query: prepareRequest(options),
	});
}

const ISO_TO_COUNTRY = Object.fromEntries(
	Object.entries(COUNTRY_TO_ISO).map(([k, v]) => [v.toLowerCase(), k]),
) as Record<string, CalendarCountryIdsType>;

const IMPACT_TO_MODEL: Record<string, CalendarImpactType> = {
	low: CalendarImpact.Low,
	medium: CalendarImpact.Medium,
	high: CalendarImpact.High,
};

function mapEventBoardResponseToModel(response: GetEventBoardResponse): IEventBoardResponse {
	return {
		days: response.days.map(day => ({
			date: day.date,
			events: day.events.map(event => ({
				id: event.id,
				canonical_ticker_id: event.canonical_ticker_id,
				metrics: event.metrics,
				details: event.details,
				meta: {
					title: event.meta.title,
					description: event.meta.description,
					datetime: event.meta.datetime,
					image: event.meta.image,
					category: event.meta.category,
					country: ISO_TO_COUNTRY[event.meta.country.toLowerCase()]
						?? event.meta.country as CalendarCountryIdsType,
					impact: IMPACT_TO_MODEL[event.meta.impact.toLowerCase()]
						?? event.meta.impact as CalendarImpactType,
					badge: event.meta.badge as ICalendarEventBadge | undefined,
				},
			})),
		})),
	};
}

function prepareRequest(request: IEventBoardRequest) {
	const record: Record<keyof IEventBoardRequest, string | number | undefined> = {
		from: request.from,
		to: request.to,
		categories: request.categories?.map(v => v.toUpperCase()).join(','),
		countries: request.countries?.map(id => COUNTRY_TO_ISO[id].toUpperCase()).join(','),
		tickerIDs: request.tickerIDs?.join(','),
		minImpact: request.minImpact?.join(','),
	};

	return record;
}
