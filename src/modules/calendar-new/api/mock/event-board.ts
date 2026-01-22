import { useFetchMock } from '@/shared/mock';
import type { IEventBoardResponse } from '../../model/contract';

const { getMock } = useFetchMock<IEventBoardResponse>('/mock/calendar/event-board.json');

export function getMockEventBoard(): Promise<IEventBoardResponse> {
	return getMock();
}
