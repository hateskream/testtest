<script setup lang="ts">
import type { ITableColumn } from '@/modules/cell';
import {
	WidgetContextMenu,
	ModalSubmenu,
	ModalSubmenuContent,
} from '../../base';

import TableColumnsSettingsComponent from './table-columns-settings-component.vue';

const props = defineProps<{
	title: string;
	dashboards: {
		id: string;
		name: string;
	}[];
}>();

const columns = defineModel<ITableColumn[]>({ required: true });

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'reset'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();
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
