import type {
	IEventBoardRequestOptions,
	IEventBoardResponse,
} from '../../models';
import data from './data.json';

export function createMockEventBoard(
	_: IEventBoardRequestOptions,
): IEventBoardResponse[] {

	return data as IEventBoardResponse[];
}
