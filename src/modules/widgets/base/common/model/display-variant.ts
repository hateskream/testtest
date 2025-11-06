import type { DisplayVariant } from '@/modules/dashboard-group';
import { IconIds } from '@/shared/ui/icon';

export const displayVariantToName: Record<DisplayVariant, string> = {
	chart: 'Chart',
	tile: 'Tile',
	bar: 'Bar',
	list: 'List',
	default: 'Default',
};

export const displayVariantToIcon: Record<DisplayVariant, IconIds> = {
	chart: IconIds.ChartView,
	tile: IconIds.TileView,
	bar: IconIds.BarView,
	list: IconIds.ListView,
	default: IconIds.Plus,
};
