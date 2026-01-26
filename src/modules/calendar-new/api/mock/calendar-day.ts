import { useFetchMock } from '@/shared/mock';
import type { IDailyInfoResponse } from '../../model/calendar';

const { getMock } = useFetchMock<IDailyInfoResponse[]>('/mock/calendar/calendar-day.json');

export async function getMockDailyInfo() {
	return getMock();
}
