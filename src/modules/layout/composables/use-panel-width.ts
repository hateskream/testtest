import {
	onBeforeUnmount,
	onMounted,
	reactive,
	readonly,
	type ComponentPublicInstance,
	type Ref,
} from 'vue';

export interface IPanelWidth {
	left: number;
	right: number;
}

export function usePanelWidth(
	leftPanelRef: Ref<ComponentPublicInstance | null>,
	rightPanelRef: Ref<ComponentPublicInstance | null>,
) {
	let disconectObserverFuncs: (() => void)[] = [];

	const pannelWidth = reactive<IPanelWidth>({
		left: 72,
		right: 72,
	});

	onMounted(() => {
		const leftElement = leftPanelRef.value?.$el as HTMLElement | null;
		const rightElement = rightPanelRef.value?.$el as HTMLElement | null;

		startObserve(leftElement, width => {
			pannelWidth.left = width;
		});

		startObserve(rightElement, width => {
			pannelWidth.right = width;
		});
	});

	onBeforeUnmount(() => {
		disconectObserverFuncs.forEach(disconect => disconect());
		disconectObserverFuncs = [];
	});

	function createResizeObserver(element: HTMLElement, setterCallback: (width: number) => void) {
		const observer = new ResizeObserver(() => {
			setterCallback(element.clientWidth);
		});

		observer.observe(element);
		return () => observer.disconnect();
	}

	function startObserve(element: HTMLElement | null, setterCallback: (width: number) => void) {
		if (!element) {
			return;
		}

		const disconect = createResizeObserver(element, setterCallback);
		disconectObserverFuncs.push(disconect);
	}

	return {
		pannelWidth: readonly(pannelWidth),
	};
}
