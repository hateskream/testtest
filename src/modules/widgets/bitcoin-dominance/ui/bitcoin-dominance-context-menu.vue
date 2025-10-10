<script setup lang="ts">
import { ModalItemSwitch, ModalSubmenu, ModalSubmenuContent, WidgetContextMenu } from '../../base';
import { useBitcoinDominanceStore } from '../store/bitcoin-dominance';

const bitcoinDominanceStore = useBitcoinDominanceStore();

const props = defineProps<{
	title: string;
	dashboards: {
		id: string;
		name: string;
	}[];
}>();

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();
</script>

<template>
	<widget-context-menu
		:dashboards="props.dashboards"
		:title="props.title"
		@delete="emit('delete')"
		@duplicate="emit('duplicate')"
		@move-to="emit('moveTo', $event)"
		@reset="bitcoinDominanceStore.resetAll"
	>
		<modal-submenu>
			<template #title> Change display </template>

			<template #content>
				<modal-submenu-content>
					<template #content>

						<modal-item-switch
							:model-value="bitcoinDominanceStore.isShowIndicator"
							@update:model-value="bitcoinDominanceStore.toggleShowIndicator"
						>
							Segmented indicator
						</modal-item-switch>

						<modal-item-switch
							:model-value="bitcoinDominanceStore.isShowHistorical"
							@update:model-value="bitcoinDominanceStore.toggleShowHistorical"
						>
							Historical values
						</modal-item-switch>

						<modal-item-switch
							:model-value="bitcoinDominanceStore.isShowChart"
							@update:model-value="bitcoinDominanceStore.toggleShowChart"
						>
							Chart
						</modal-item-switch>
					</template>
				</modal-submenu-content>
			</template>
		</modal-submenu>
	</widget-context-menu>
</template>
