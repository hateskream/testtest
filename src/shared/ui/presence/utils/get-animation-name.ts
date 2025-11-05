export function getAnimationName(node?: HTMLElement) {
	return node ? getComputedStyle(node).animationName || 'none' : 'none';
}
