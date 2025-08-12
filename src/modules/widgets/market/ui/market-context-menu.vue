<script setup lang="ts">
import { useMarketStore } from '../stores';
import {
	WidgetContextMenu,
	ModalSubmenu,
	ModalSubmenuContent,
} from '../../base';

import TableColumnsSettingsComponent from './table-columns-settings-component.vue';

const marketStore = useMarketStore();

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
		@reset="marketStore.resetAll"
	>
		<modal-submenu>
			<template #title>Change display</template>

			<template #content>
				<modal-submenu-content>
					<template #content>
						<modal-submenu>
							<template #title> Column metrics </template>
							<template #content>
								<table-columns-settings-component />
							</template>
						</modal-submenu>
					</template>
				</modal-submenu-content>
			</template>
		</modal-submenu>

	</widget-context-menu>
</template>
