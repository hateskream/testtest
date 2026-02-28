import type { CSSProperties } from 'vue';

export interface ILegendOption {
	/**
	 * Текст опции
	 */
	label?: string;

	/**
	 * Цвет hint (кружок)
	 */
	color: string;

	hint?: Omit<ILegendOptionHint, 'color'>;
}

export interface ILegendOptionHint {
	color: string;
	border?: CSSProperties['border'];
}
