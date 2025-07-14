import type { IWidgetState } from '@/modules/dashboard-group/core';
import type { IPosition } from '../model';


export function mapToWidgetState(positions: IPosition[]): IWidgetState[] {
	return positions.map(item => ({
		position: item,
		id: item.i,
	}));
}
