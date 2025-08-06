<script setup lang="ts">
import {
	ModalItemCheckbox,
	WidgetContextMenu,
	ModalSubmenu,
	ModalSubmenuContent,
} from '../../base';
import { useBitcoinDominanceStore } from '../store/bitcoin-dominance';

const bitcoinDominanceStore = useBitcoinDominanceStore();

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
		@reset="bitcoinDominanceStore.resetAll"
	>
		<modal-submenu>
			<template #title> Change display </template>

			<template #content>
				<modal-submenu-content>
					<template #content>

						<modal-item-checkbox
							:model-value="bitcoinDominanceStore.isShowIndicator"
							@update:model-value="bitcoinDominanceStore.toggleShowIndicator"
						>
							Segmented indicator
						</modal-item-checkbox>

						<modal-item-checkbox
							:model-value="bitcoinDominanceStore.isShowHistorical"
							@update:model-value="bitcoinDominanceStore.toggleShowHistorical"
						>
							Historical values
						</modal-item-checkbox>

						<modal-item-checkbox
							:model-value="bitcoinDominanceStore.isShowChart"
							@update:model-value="bitcoinDominanceStore.toggleShowChart"
						>
							Chart
						</modal-item-checkbox>
					</template>
				</modal-submenu-content>
			</template>
		</modal-submenu>
	</widget-context-menu>
</template>
