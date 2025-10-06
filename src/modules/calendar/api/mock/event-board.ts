import { useFetchMock } from '@/shared/mock';
import type {
	IEventBoardRequestOptions,
	IEventBoardResponse,
} from '../../models';

const { getMock } = useFetchMock<IEventBoardResponse[]>('/mock/calendar/event-board.json');

export function createMockEventBoard(
	_: IEventBoardRequestOptions,
): Promise<IEventBoardResponse[]> {
	return getMock();
}
