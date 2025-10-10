import { ref, watch } from 'vue';

const currentOpenRcmId = ref<number | null>(null);

export function useGlobalRcm(instanceId: number) {
	const isOpen = ref(false);

	function open() {
		currentOpenRcmId.value = instanceId;
		isOpen.value = true;
	}

	function close() {
		if (currentOpenRcmId.value === instanceId) {
			currentOpenRcmId.value = null;
		}
		isOpen.value = false;
	}

	watch(currentOpenRcmId, (newId) => {
		if (newId !== instanceId && isOpen.value) {
			isOpen.value = false;
		}
	});

	return {
		isOpen,
		open,
		close,
	};
}
