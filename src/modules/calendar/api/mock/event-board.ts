import { useFetchMock } from '@/shared/mock';
import type {
	IEventBoardRequestOptions,
	IEventBoardItem,
} from '../../models';

const { getMock } = useFetchMock<IEventBoardItem[]>('/mock/calendar/event-board.json');

export function createMockEventBoard(
	_: IEventBoardRequestOptions,
): Promise<IEventBoardItem[]> {
	return getMock();
}
