import { useFetchMock } from '@/shared/mock';
import type { IDailyCalendarInfoRequest, IDailyCalendarInfoResponse } from '../../models';

const { getMock } = useFetchMock<IDailyCalendarInfoResponse[]>('/mock/calendar/calendar-day.json');

export async function createMockApiDays(_: IDailyCalendarInfoRequest): Promise<IDailyCalendarInfoResponse[]> {
	return getMock();
}
