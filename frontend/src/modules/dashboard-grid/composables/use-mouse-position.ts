import { ref, onMounted, onBeforeUnmount, readonly } from 'vue';

interface IMousePosition {
	x: number;
	y: number;
}

export function useMousePositionSync() {
	const mouseAt = ref<IMousePosition>({ x: -1, y: -1 });

	onMounted(() => {
		document.addEventListener('dragover', syncMousePosition);
		document.addEventListener('mousemove', syncMousePosition);
		document.addEventListener('touchmove', syncMousePosition, { passive: false });
	});

	onBeforeUnmount(() => {
		document.removeEventListener('dragover', syncMousePosition);
		document.removeEventListener('mousemove', syncMousePosition);
		document.removeEventListener('touchmove', syncMousePosition);
	});

	function syncMousePosition(event: MouseEvent | TouchEvent) {
		if ('touches' in event) {
			// eslint-disable-next-line prefer-destructuring
			const touch = event.touches[0];
			mouseAt.value.x = touch.clientX;
			mouseAt.value.y = touch.clientY;
		} else {
			mouseAt.value.x = event.clientX;
			mouseAt.value.y = event.clientY;
		}
	}

	return { mouseAt: readonly(mouseAt) };
}
