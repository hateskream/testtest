import type { ObjectEnum } from '@/shared/types';

export const Layout = {
	Desktop: 'desktop',
	Tablet: 'tablet',
	Mobile: 'mobile',
} as const;

export type LayoutType = ObjectEnum<typeof Layout>;
