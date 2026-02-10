import type { IconIds } from '@/shared/ui/icon';
import type { ObjectEnum } from '@/shared/types';

export const TagColor = {
	Neutral: 'neutral',
	Positive: 'positive',
	Negative: 'negative',
} as const;

export type TagColorType = ObjectEnum<typeof TagColor>;

export interface IUiTagProps {
	icon?: IconIds | null;
	iconSize?: number;
	iconPosition?: 'start' | 'end';
	color?: TagColorType;
}

