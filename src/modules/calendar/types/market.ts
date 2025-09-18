import { MarketIds } from '@/modules/calendar';
import { IconIds } from '@/shared/ui/icon';

export interface IMarketData {
	id: MarketIds;
	label: string;
	icon: IconIds;
}
