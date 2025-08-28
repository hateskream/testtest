<script setup lang="ts">
import {
	ModalItemCheckbox,
	WidgetContextMenu,
	ModalSubmenu,
	ModalSubmenuContent,
} from '../../base';
import { useMarketCapStore } from '../store/market-cap';

const marketCapStore = useMarketCapStore();

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
		@reset="marketCapStore.resetAll"
	>
		<modal-submenu>
			<template #title>Change display</template>

			<template #content>
				<modal-submenu-content>
					<template #content>
						<modal-item-checkbox
							:model-value="marketCapStore.isShowChart"
							@update:model-value="marketCapStore.toggleShowChart"
						>
							Chart
						</modal-item-checkbox>
						<modal-item-checkbox
							:model-value="marketCapStore.isShowChange"
							@update:model-value="marketCapStore.toggleShowChange"
						>
							Change, %
						</modal-item-checkbox>
					</template>
				</modal-submenu-content>
			</template>
		</modal-submenu>
	</widget-context-menu>
</template>
