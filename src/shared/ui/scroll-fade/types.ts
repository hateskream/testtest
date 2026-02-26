type ScrollDirection = 'vertical' | 'horizontal';

export interface IScrollFadeProps {
	/**
	 * Размер fade-элемента в пикселях
	 * @default 24
	 */
	size?: number;

	/**
	 * Направление скролла (вертикальный/горизонтальный)
	 * @default vertical
	 */
	direction?: ScrollDirection;

	/**
	 * Отключить поведение
	 * @default false
	 */
	disabled?: boolean;
}
