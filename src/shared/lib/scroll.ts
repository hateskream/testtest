/**
 * Определить проскроллен ли элемент до конца
 * @param element
 */
export function isScrolledToBottom(element: HTMLElement) {
	return element.scrollTop + element.clientHeight >= element.scrollHeight;
}

/**
 * Определить проскроллен ли элемент до начала
 * @param element
 */
export function isScrolledToTop(element: HTMLElement) {
	return element.scrollTop === 0;
}

/**
 * Является ли текущая delta scroll/wheel-события направленной вниз
 */
export function isScrollingDown(delta: number) {
	return delta > 0;
}

/**
 * Является ли текущая delta scroll/wheel-события направленной вверх
 */
export function isScrollingUp(delta: number) {
	return delta < 0;
}

/**
 * Прекращает дальнейшее распространение события и отменяет его действие по умолчанию.
 * `stopPropagation` + `preventDefault`
 */
export function preventDefaultScrollBehavior(event: WheelEvent) {
	event.stopPropagation();
	event.preventDefault();
}
