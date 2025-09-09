import { IconIds } from '@/shared/ui/icon';

export interface IBottomNavigationItem {
	icon: IconIds;
	id: IconIds;
	routeName: string;
	routeParams?: Record<string, string | number>;
}
