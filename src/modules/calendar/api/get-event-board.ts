import { z } from 'zod';

import {
	type IEventBoardRequest,
	CalendarCategory,
	CalendarCountryIds,
	CalendarImpact,
	COUNTRY_TO_ISO,
} from '../model/calendar';
import { useLogger } from '@/shared/service/monitoring';
import { useApiClient } from '@/shared/service/api';
import { getMockEventBoard } from './mock/event-board';

const IS_USE_MOCK = false;

const CalendarEventBadgeSchema = z.object({
	label: z.string(),
	color: z.enum(['negative', 'neutral', 'positive']),
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
		country: z.nativeEnum(CalendarCountryIds),
		impact: z.nativeEnum(CalendarImpact),
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

export async function getEventBoard(request: IEventBoardRequest): Promise<GetEventBoardResponse> {
	try {
		return IS_USE_MOCK
			? GetEventBoardResponseSchema.parse(await getMockEventBoard())
			: getApiEventBoard(request);
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
