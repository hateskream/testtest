<script setup lang="ts">
import { ModalSubmenu, WidgetContextMenu } from '@/modules/widgets/base';
import { ModalTickerSelector } from '@/modules/ticker-selector';

const selectedTicker = defineModel<string>('selectedTicker', { required: true });

const props = defineProps<{
	title: string;
	dashboards: {
		id: string;
		name: string;
	}[];
}>();

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'reset'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();

function updateTicker(newValue: string[]) {
	[selectedTicker.value] = newValue;
}
</script>

<template>
	<widget-context-menu
		:title="props.title"
		:dashboards="props.dashboards"
		@delete="emit('delete')"
		@reset="emit('reset')"
		@move-to="emit('moveTo', $event)"
		@duplicate="emit('duplicate')"
	>
		<modal-submenu>
			<template #title>Choose ticker</template>
			<template #content>
				<modal-ticker-selector
					:model-value="[selectedTicker]"
					:enable-selected-info="false"
					:enable-select-all="false"
					selection-mode="single"
					@update:model-value="updateTicker"
				/>
			</template>
		</modal-submenu>
	</widget-context-menu>
</template>
