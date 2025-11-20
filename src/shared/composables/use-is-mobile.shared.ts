import { createSharedComposable, useMediaQuery } from '@vueuse/core';
import { computed } from 'vue';

export const useIsMobile = createSharedComposable(() => {
	const isLargeScreen = useMediaQuery('(min-width: 768px)');

	return computed(() => !isLargeScreen.value);
});
