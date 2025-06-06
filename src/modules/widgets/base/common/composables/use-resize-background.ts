import { computed } from 'vue';

import { useResizeContext } from './use-resize-context';

export function useResizeBackground() {
	const isResizing = useResizeContext();

	const backgroundStyle = computed(() => ({
		backgroundColor: isResizing
			? 'var(--bg-color-surface-02)'
			: 'var(--bg-color-surface-01)',
	}));

	return {
		backgroundStyle,
	};
}
