<script setup lang="ts">
import { ModalSubmenu, WidgetContextMenu } from '@/modules/widgets/base';
import { usePerformanceStore } from '@/modules/widgets/performance/stores';
import type { IAltcoinSeasonConfig, Period } from '@/modules/widgets/altcoinSeason/model';

import AltcoinSeasonTimeFilter from './altcoin-season-time-filter.vue';
import AltcoinSeasonWidgetConfig from './altcoin-season-widget-config.vue';

const performanceStore = usePerformanceStore();

interface IAltcoinSeasonContextMenuProps {
	title: string;
	modules: IAltcoinSeasonConfig['modules'] | null;
	dashboards: {
		id: string;
		name: string;
	}[];
}
const props = defineProps<IAltcoinSeasonContextMenuProps>();

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();

const period = defineModel<Period>('period', { required: true });
const selectedModules = defineModel<IAltcoinSeasonConfig['modules']>('selectedModules', { required: true });

const resetAll = () => {
	performanceStore.resetAll();
};
</script>

<template>
	<widget-context-menu
		:dashboards="props.dashboards"
		:title="props.title"
		@delete="emit('delete')"
		@reset="resetAll"
		@move-to="emit('moveTo', $event)"
		@duplicate="emit('duplicate')"
	>
		<modal-submenu>
			<template #title>Change display</template>
			<template #content>
				<altcoin-season-widget-config
					v-if="props.modules"
					v-model:selected-modules="selectedModules"
					:modules="props.modules"
				/>
			</template>
		</modal-submenu>

		<modal-submenu>
			<template #title>Filter</template>
			<template #content>
				<altcoin-season-time-filter v-model:period="period" />
			</template>
		</modal-submenu>
	</widget-context-menu>
</template>
