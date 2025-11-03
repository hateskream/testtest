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
	chart: IconIds.Plus,
	tile: IconIds.Plus,
	bar: IconIds.Plus,
	list: IconIds.Plus,
	default: IconIds.Plus,
};
