<script setup lang="ts">
import { ModalSubmenu, WidgetContextMenu } from '@/modules/widgets/base';
import type { DisplayVariant, Stock, DateRange } from '../../model';

import PerformanceFilter from './performance-filters.vue';

const displayVariant = defineModel<DisplayVariant>('displayVariant', { required: true });
const stock = defineModel<Stock>('stock', { required: true });
const date = defineModel<DateRange>('date', { required: true });
const isCompactMode = defineModel<boolean>('isCompactMode', { required: true });

const props = defineProps<{
	title: string;
}>();

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'reset'): void;
}>();
</script>

<template>
	<widget-context-menu
		:title="props.title"
		@delete="emit('delete')"
		@reset="emit('reset')"
	>
		<modal-submenu>
			<template #title>Filter</template>
			<template #content>
				<performance-filter
					v-model:is-compact-mode="isCompactMode"
					v-model:display-variant="displayVariant"
					v-model:stock="stock"
					v-model:date="date"
				/>
			</template>
		</modal-submenu>
	</widget-context-menu>
</template>
