<script setup lang="ts">
import { ModalSubmenu, WidgetContextMenu } from '@/modules/widgets/base';
import { usePriceStore } from '../stores';

import RcmPriceComponent from './rcm-price-component.vue';


const priceStore = usePriceStore();

const props = defineProps<{
	title: string;
}>();

const emit = defineEmits<{
	(e: 'delete'): void;
}>();


</script>

<template>
	<widget-context-menu
		:title="props.title"
		@delete="emit('delete')"
		@reset="priceStore.resetAll"
	>
		<modal-submenu>
			<template #title>Change display</template>
			<template #content>
				<rcm-price-component />
			</template>
		</modal-submenu>
	</widget-context-menu>
</template>
