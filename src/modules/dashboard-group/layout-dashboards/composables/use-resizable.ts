import {
	ref,
	onBeforeUnmount,
	type Ref,
	readonly,
	type MaybeRefOrGetter,
	toValue,
	computed,
	watch,
	onMounted,
} from 'vue';

type ResizeAxis = 'horizontal' | 'vertical';

interface IUseResizableOptions {
	axis?: ResizeAxis;
	minWidth?: number;
	maxWidth?: number;
	minHeight?: number;
	maxHeight?: number;
	cbOnPointerUp?: () => void;
	isActivated?: MaybeRefOrGetter<boolean>;
}

export function useResizable(
	handleRef: Ref<HTMLElement | null>,
	resizeTargetRef: Ref<HTMLElement | null>,
	options: IUseResizableOptions = {},
) {
	const {
		axis = 'horizontal',
		minWidth = 0,
		maxWidth = Infinity,
		minHeight = 0,
		maxHeight = Infinity,
		cbOnPointerUp,
	} = options;

	const isActivated = computed(() => toValue(options.isActivated ?? true));

	const isResizing = ref(false);
	const size = ref(0);
	const startSize = ref(0);

	let startX = 0;
	let startY = 0;
	let rafId: number | null = null;

	const onPointerMove = (e: PointerEvent) => {
		if (!isResizing.value) {
			return;
		}

		const dx = e.clientX - startX;
		const dy = e.clientY - startY;

		if (rafId) {
			cancelAnimationFrame(rafId);
		}

		rafId = requestAnimationFrame(() => {
			let newSize = startSize.value;

			if (axis === 'horizontal') {
				newSize = Math.min(
					Math.max(startSize.value + dx, minWidth),
					maxWidth,
				);
			} else {
				newSize = Math.min(
					Math.max(startSize.value + dy, minHeight),
					maxHeight,
				);
			}

			size.value = newSize;
			rafId = null;
		});
	};

	const onPointerUp = (e: PointerEvent) => {
		isResizing.value = false;

		const handle = handleRef.value;
		if (handle?.hasPointerCapture(e.pointerId)) {
			handle.releasePointerCapture(e.pointerId);
		}

		document.removeEventListener('pointermove', onPointerMove);
		document.removeEventListener('pointerup', onPointerUp);
		document.removeEventListener('pointercancel', onPointerUp);

		if (rafId) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}

		cbOnPointerUp?.();
	};

	const startResize = (e: PointerEvent) => {
		if (!isActivated.value) {
			return;
		}

		const handle = handleRef.value;
		const target = resizeTargetRef.value;
		if (!handle || !target) {
			return;
		}

		e.stopPropagation();
		handle.setPointerCapture(e.pointerId);

		isResizing.value = true;

		document.addEventListener('pointermove', onPointerMove, { passive: true });
		document.addEventListener('pointerup', onPointerUp);
		document.addEventListener('pointercancel', onPointerUp);

		startX = e.clientX;
		startY = e.clientY;

		startSize.value =
			axis === 'horizontal'
				? target.offsetWidth
				: target.offsetHeight;

		size.value = startSize.value;
	};

	const addListener = () => {
		const handle = handleRef.value;
		if (handle) {
			handle.addEventListener('pointerdown', startResize);
		}
	};

	const removeListener = () => {
		const handle = handleRef.value;
		if (handle) {
			handle.removeEventListener('pointerdown', startResize);
		}
	};

	watch(
		[isActivated, () => handleRef.value],
		([active]) => {
			if (active) {
				addListener();
			} else {
				removeListener();

				isResizing.value = false;

				document.removeEventListener('pointermove', onPointerMove);
				document.removeEventListener('pointerup', onPointerUp);
				document.removeEventListener('pointercancel', onPointerUp);
			}
		},
		{ immediate: true },
	);

	onMounted(() => {
		const targetEl = resizeTargetRef.value;
		if (!targetEl) {
			return;
		}

		size.value =
			axis === 'horizontal'
				? targetEl.offsetWidth
				: targetEl.offsetHeight;
	});

	onBeforeUnmount(() => {
		removeListener();

		document.removeEventListener('pointermove', onPointerMove);
		document.removeEventListener('pointerup', onPointerUp);
		document.removeEventListener('pointercancel', onPointerUp);
	});

	return {
		isResizing: readonly(isResizing),
		size: readonly(size),
	};
}
