import type { IconIds } from '@/shared/ui/icon';
import type { RouteNames } from '@/types/route';

export interface IMenuItem {
	icon: IconIds;
	text: string;
	link: RouteNames | (string & Record<never, never>);
	isActive: boolean;
}
