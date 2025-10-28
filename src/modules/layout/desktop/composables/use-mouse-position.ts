import { onBeforeUnmount, onMounted, ref, computed, type ShallowRef } from 'vue';
import { throttle } from '@vexip-ui/utils';

export function useMousePosition(elementRef: Readonly<ShallowRef<HTMLElement | null>>) {
	const mouseAt = ref({ x: 0, y: 0 });

	const isMouseInElement = computed(() => {
		if (!elementRef.value) {
			return false;
		}

		const { left, top, right, bottom	} = elementRef.value.getBoundingClientRect();

		return (
			mouseAt.value.x > left &&
				mouseAt.value.x < right &&
				mouseAt.value.y > top &&
				mouseAt.value.y < bottom
		);
	});

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

	return { isMouseInElement };
}
