<script setup lang="ts">
import {
	ModalItemCheckbox,
	WidgetContextMenu,
	ModalSubmenu,
	ModalSubmenuContent,
} from '../../base';
import { useBitcoinDominancStore } from '../store/bitcoin-dominanc';

const bitcoinDominancStore = useBitcoinDominancStore();

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
		@reset="bitcoinDominancStore.resetAll"
	>
		<modal-submenu>
			<template #title> Change display </template>

			<template #content>
				<modal-submenu-content>
					<template #content>

						<modal-item-checkbox
							:model-value="bitcoinDominancStore.isShowIndicator"
							@update:model-value="bitcoinDominancStore.toggleShowIndicator"
						>
							Segmented indicator
						</modal-item-checkbox>

						<modal-item-checkbox
							:model-value="bitcoinDominancStore.isShowHistorical"
							@update:model-value="bitcoinDominancStore.toggleShowHistorical"
						>
							Historical values
						</modal-item-checkbox>

						<modal-item-checkbox
							:model-value="bitcoinDominancStore.isShowChart"
							@update:model-value="bitcoinDominancStore.toggleShowChart"
						>
							Chart
						</modal-item-checkbox>
					</template>
				</modal-submenu-content>
			</template>
		</modal-submenu>
	</widget-context-menu>
</template>
