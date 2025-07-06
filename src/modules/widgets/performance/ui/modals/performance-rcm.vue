<script setup lang="ts">
import { UiDriver } from '@/shared/ui/driver';
import { usePerformanceStore } from '@/modules/widgets/performance/stores';
import {
	ModalItem,
	ModalItemNumber,
	ModalRcm,
	ModalSubmenu,
} from '@/modules/widgets/base';

import PerformanceFilter from './performance-filters.vue';

const performanceStore = usePerformanceStore();
</script>

<template>
	<modal-rcm>
		<template #title>Performance</template>

		<template #content>
			<modal-item-number :value="1">Duplicate</modal-item-number>
			<modal-item-number :value="2">Open in new tab</modal-item-number>
			<modal-item-number :value="3">Wrap in stack</modal-item-number>

			<modal-item>Move to</modal-item>

			<ui-driver />

			<modal-submenu>
				<template #title>Filter</template>
				<template #content>
					<performance-filter />
				</template>
			</modal-submenu>

			<modal-item @click="performanceStore.resetAll">Reset all changes</modal-item>

			<ui-driver />

			<modal-item>Delete</modal-item>
		</template>
	</modal-rcm>
</template>
