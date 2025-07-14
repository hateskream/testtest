import { onMounted, onBeforeUnmount, readonly } from 'vue';

export function useMousePositionSync() {
	const mouseAt = { x: -1, y: -1 };

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
			const [touch] = event.touches;
			mouseAt.x = touch.clientX;
			mouseAt.y = touch.clientY;
		} else {
			mouseAt.x = event.clientX;
			mouseAt.y = event.clientY;
		}
	}

	return { mouseAt: readonly(mouseAt) };
}
