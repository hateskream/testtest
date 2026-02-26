import { IconIds } from '@/shared/ui/icon';

export interface IErrorAction {
	name: string;
	label: string;
	variant: 'primary' | 'secondary';
	icon?: IconIds;
	action: ErrorActionKey;
}

export const ErrorActionKey = {
	HOMEPAGE: 'homepage',
	REFRESH: 'refresh',
	LOGIN: 'login',
	SUPPORT: 'support',
};

export type ErrorActionKey = typeof ErrorActionKey[keyof typeof ErrorActionKey];

export const HOMEPAGE_ACTION: IErrorAction = {
	name: 'homepage',
	label: 'Homepage',
	variant: 'primary',
	action: ErrorActionKey.HOMEPAGE,
};

export const REFRESH_ACTION: IErrorAction = {
	name: 'refresh',
	label: 'Refresh',
	variant: 'secondary',
	icon: IconIds.Retry,
	action: ErrorActionKey.REFRESH,
};
