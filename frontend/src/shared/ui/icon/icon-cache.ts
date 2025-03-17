import { defineAsyncComponent, type Component } from 'vue';

import { IconIds } from './icons';

import IconPlaceholder from './icon-placeholder.vue';

const iconCache = new Map<IconIds, Component>();

export function getIconComponent(id: IconIds): Component {
	if (!iconCache.has(id)) {
		const iconComponent = defineAsyncComponent({
			loader: async () => import(`@/assets/icons/${id}.svg`),
			loadingComponent: IconPlaceholder,
			errorComponent: IconPlaceholder,
		});
		iconCache.set(id, iconComponent);
	}
	return iconCache.get(id)!;
}
