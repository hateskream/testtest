<script setup lang="ts">
import { useAltcoinSeasonStore } from '../../stores';
import { ModalSubmenu, WidgetContextMenu } from '@/modules/widgets/base';
import { usePerformanceStore } from '@/modules/widgets/performance/stores';

import AltcoinSeasonTimeFilter from './altcoin-season-time-filter.vue';
import AltcoinSeasonWidgetConfig from './altcoin-season-widget-config.vue';

const altcoinSeasonStore = useAltcoinSeasonStore();
const performanceStore = usePerformanceStore();

interface IAltcoinSeasonContextMenuProps {
	title: string;
}
const props = defineProps<IAltcoinSeasonContextMenuProps>();

const emit = defineEmits<{
	(e: 'delete'): void;
}>();

const resetAll = () => {
	altcoinSeasonStore.resetConfigToDefault();
	performanceStore.resetAll();
};

</script>

<template>
	<widget-context-menu
		:title="props.title"
		@delete="emit('delete')"
		@reset="resetAll"
	>
		<modal-submenu>
			<template #title>Change display</template>
			<template #content>
				<altcoin-season-widget-config />
			</template>
		</modal-submenu>

		<modal-submenu>
			<template #title>Filter</template>
			<template #content>
				<altcoin-season-time-filter />
			</template>
		</modal-submenu>
	</widget-context-menu>
</template>
