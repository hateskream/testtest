import { autoUpdate, flip, offset, shift, useFloating, type VirtualElement } from '@floating-ui/vue';
import { onClickOutside } from '@vueuse/core';
import { ref, watch, type Ref } from 'vue';

const currentOpenRcmId = ref<string | null>(null);

export function useGlobalRcm(instanceId: string, rcmRef: Ref<HTMLElement | null>) {
	const isOpen = ref(false);

	const reference = ref<VirtualElement | null>(null);

	const { floatingStyles } = useFloating(reference, rcmRef, {
		placement: 'right-start',
		strategy: 'fixed',
		middleware: [offset(6), flip(), shift({ padding: 5 })],
		whileElementsMounted: autoUpdate,
	});

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

	function handleOpen(e: MouseEvent) {
		reference.value = {
			getBoundingClientRect() {
				return {
					width: 0,
					height: 0,
					x: e.clientX,
					y: e.clientY,
					top: e.clientY,
					left: e.clientX,
					right: e.clientX,
					bottom: e.clientY,
				};
			},
		};

		open();
	}

	onClickOutside(rcmRef, () => {
		close();
	});

	return {
		isOpen,
		handleOpen,
		close,
		floatingStyles,
	};
}
