import { DateRangePreset, type DateRangePresetType, type DateRangeValue } from '@/modules/charts/common/model';

// На данный момент поддерживаются события только на дневном просмотре
export const TIMELINE_EVENTS_ALLOWED = new Set<DateRangePresetType>([
	DateRangePreset.Day,
]);

export function isTimelineEventsVisible(range: DateRangeValue): boolean {
	if (range.type === 'preset') {
		TIMELINE_EVENTS_ALLOWED.has(range.preset);
	}

	return false;
}
