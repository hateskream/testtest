import { IconIds } from '@/shared/ui/icon';
import { type ErrorCode as ErrorCodeType, ErrorCode } from './code';
import { ErrorActionKey, HOMEPAGE_ACTION, type IErrorAction, REFRESH_ACTION } from './action';

export interface IErrorConfig {
	title: string;
	description: string;
	previewSrc: string;
	actions: IErrorAction[];
}

export const errorConfig: Record<ErrorCodeType, IErrorConfig> = {
	[ErrorCode.AUTHORIZATION_REQUIRED]: {
		title: 'Authorization required',
		description: 'You need to be logged in to access this page. Please sign in to continue',
		previewSrc: '/images/error/401.png',
		actions: [
			{ name: 'login', label: 'Log in', variant: 'primary', action: ErrorActionKey.LOGIN },
			{ ...HOMEPAGE_ACTION, variant: 'secondary' },
		],
	},
	[ErrorCode.ACCESS_DENIED]: {
		title: 'Access denied',
		description: 'You don’t have permission to view this page',
		previewSrc: '/images/error/403.png',
		actions: [
			HOMEPAGE_ACTION,
			{ name: 'support', label: 'Contact support', variant: 'secondary', action: ErrorActionKey.SUPPORT },
		],
	},
	[ErrorCode.NOT_FOUND]: {
		title: 'Oops! Page not found',
		// eslint-disable-next-line @stylistic/max-len
		description: 'The page you’re looking for doesn’t exist or may have been moved. Please try refreshing the page or go back to the homepage.',
		previewSrc: '/images/error/404.png',
		actions: [HOMEPAGE_ACTION, REFRESH_ACTION],
	},
	[ErrorCode.NO_LONGER_AVAILABLE]: {
		title: 'Page no longer available',
		description: 'This page has been permanently removed or is no longer accessible',
		previewSrc: '/images/error/410.png',
		actions: [HOMEPAGE_ACTION],
	},
	[ErrorCode.SERVER_ERROR]: {
		title: 'Something went wrong',
		description: 'We’re having trouble loading this page. Please try again shortly',
		previewSrc: '/images/error/500.png',
		actions: [HOMEPAGE_ACTION, REFRESH_ACTION],
	},
	[ErrorCode.TEMPORARILY_UNAVAILABLE]: {
		title: 'Service temporarily unavailable',
		description: 'The service is currently unavailable. Please try again in a moment',
		previewSrc: '/images/error/502.png',
		actions: [
			HOMEPAGE_ACTION,
			{
				name: 'retry',
				label: 'Retry',
				variant: 'secondary',
				icon: IconIds.Retry, action: ErrorActionKey.REFRESH,
			},
		],
	},
};
