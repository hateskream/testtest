import { computed, inject } from 'vue';

export function useResizeBackground() {
	const isResizing = inject('isResize') as boolean;

	const backgroundStyle = computed(() => ({
		backgroundColor: isResizing
			? 'var(--bg-color-surface-02)'
			: 'var(--bg-color-surface-01)',
	}));

	return {
		backgroundStyle,
	};
}
