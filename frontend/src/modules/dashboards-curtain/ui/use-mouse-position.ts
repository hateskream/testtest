import { onMounted, onBeforeUnmount, readonly, ref } from 'vue';
import { throttle } from '@vexip-ui/utils';

export function useMousePositionSync() {
	const mouseAt = ref({ x: -1, y: -1 });

	const trottledSyncMousePosition = throttle(syncMousePosition, 300);

	onMounted(() => {
		document.addEventListener('mousemove', trottledSyncMousePosition);
		document.addEventListener('touchmove', trottledSyncMousePosition, { passive: false });
	});

	onBeforeUnmount(() => {
		document.removeEventListener('mousemove', trottledSyncMousePosition);
		document.removeEventListener('touchmove', trottledSyncMousePosition);
	});

	function syncMousePosition(event: MouseEvent | TouchEvent) {
		if ('touches' in event) {
			const [touch] = event.touches;
			mouseAt.value.x = touch.clientX;
			mouseAt.value.y = touch.clientY;
		} else {
			mouseAt.value.x = event.clientX;
			mouseAt.value.y = event.clientY;
		}
	}

	return { mouseAt: readonly(mouseAt) };
}
