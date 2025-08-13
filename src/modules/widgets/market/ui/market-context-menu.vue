<script setup lang="ts">
import {
	WidgetContextMenu,
	ModalSubmenu,
	ModalSubmenuContent,
} from '../../base';
import type { ITableColumn } from '../model';

import TableColumnsSettingsComponent from './table-columns-settings-component.vue';

const props = defineProps<{
	title: string;
}>();

const columns = defineModel<ITableColumn[]>({ required: true });

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
			<template #title>Change display</template>

			<template #content>
				<modal-submenu-content>
					<template #content>
						<modal-submenu>
							<template #title> Column metrics </template>
							<template #content>
								<table-columns-settings-component v-model="columns" />
							</template>
						</modal-submenu>
					</template>
				</modal-submenu-content>
			</template>
		</modal-submenu>

	</widget-context-menu>
</template>
