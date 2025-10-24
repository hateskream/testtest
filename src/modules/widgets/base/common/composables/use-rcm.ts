import { onUnmounted, ref } from 'vue';

import {
	makeVirtualFromMouseEvent,
	useFloatingContext,
	type FloatingContentRenderable,
} from '@/app/plugins/floating';

const currentOpenRcmId = ref<string | null>(null);

export function useGlobalRcm(instanceId: string) {
	const floating = useFloatingContext();
	const isOpen = ref(false);

	function open(content: () => FloatingContentRenderable, e: MouseEvent) {
		currentOpenRcmId.value = instanceId;
		isOpen.value = true;

		floating.open({
			reference: makeVirtualFromMouseEvent(e),
			content: content,
			options: {
				trigger: 'contextmenu',
				placement: 'right-start',
				strategy: 'fixed',
				offset: 6,
				hideDelayMs: 120,
			},
			onClose: () => {
				isOpen.value = false;
				if (currentOpenRcmId.value === instanceId) {
					currentOpenRcmId.value = null;
				}
			},
		});
	}

	function close() {
		if (currentOpenRcmId.value === instanceId) {
			currentOpenRcmId.value = null;
		}
		isOpen.value = false;
		floating.close(true);
	}

	onUnmounted(() => {
		if (isOpen.value) {
			floating.close(true);
		}
	});

	return { isOpen, open, close };
}
