import { TimeRangeFilterValue } from './time-range';

// На данный момент поддерживаются события только на дневном просмотре
export const TIMELINE_EVENTS_ALLOWED = new Set<TimeRangeFilterValue>([
	TimeRangeFilterValue.Day,
]);

export function isTimelineEventsVisible(range: TimeRangeFilterValue): boolean {
	return TIMELINE_EVENTS_ALLOWED.has(range);
}
