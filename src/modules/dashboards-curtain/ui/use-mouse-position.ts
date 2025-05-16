import { onMounted, onBeforeUnmount, readonly, ref, computed, type Ref } from 'vue';
import { throttle } from '@vexip-ui/utils';

export function useСanDelete(rootRef: Ref<HTMLDivElement | null>) {
	const mouseAt = ref({ x: -1, y: -1 });
	const isMouseUp = ref(false);

	const isIn = computed(() => {
		if (!rootRef.value) {
			return false;
		}

		const { left, top, right, bottom	} = rootRef.value.getBoundingClientRect();

		return (
			mouseAt.value.x > left &&
			mouseAt.value.x < right &&
			mouseAt.value.y > top &&
			mouseAt.value.y < bottom
		);
	});

	const canDelete = computed(() => isIn.value && isMouseUp.value);

	const trottledSyncMousePosition = throttle(syncMousePosition, 300);

	onMounted(() => {
		document.addEventListener('mousemove', trottledSyncMousePosition);
		document.addEventListener('touchmove', trottledSyncMousePosition, { passive: false });
		document.addEventListener('mouseup', setMouseUp);
		document.addEventListener('mousedown', setMouseDown);
	});

	onBeforeUnmount(() => {
		document.removeEventListener('mousemove', trottledSyncMousePosition);
		document.removeEventListener('touchmove', trottledSyncMousePosition);
		document.removeEventListener('mouseup', setMouseUp);
		document.removeEventListener('mousedown', setMouseDown);
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

	function setMouseUp() {
		isMouseUp.value = true;
	}

	function setMouseDown() {
		isMouseUp.value = false;
	}

	return { canDelete: readonly(canDelete) };
}
