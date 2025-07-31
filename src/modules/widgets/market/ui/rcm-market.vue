<script setup lang="ts">
import { UiDriver } from '@/shared/ui/driver';
import { useMarketStore } from '../stores';
import {
	ModalItem,
	ModalItemCheckbox,
	ModalItemNumber,
	ModalRcm,
	ModalSubmenu,
	ModalSubmenuContent,
} from '../../base';

import TableColumnsSettingsComponent from './table-columns-settings-component.vue';

const marketStore = useMarketStore();

const emit = defineEmits<{
	(e: 'delete'): void;
}>();
</script>

<template>
	<modal-rcm>
		<template #title> Market </template>
		<template #content>
			<modal-item-number :value="1">Duplicate</modal-item-number>
			<modal-item-number :value="2">Open full data</modal-item-number>
			<modal-item-number :value="3">Wrap in stack</modal-item-number>

			<modal-item>Move to</modal-item>

			<ui-driver />

			<modal-submenu>
				<template #title> Change display </template>

				<template #content>
					<modal-submenu-content>
						<template #content>
							<modal-item-checkbox
								:model-value="marketStore.isFavorites"
								@update:model-value="marketStore.toggleFavorites"
							>
								Only favorites
							</modal-item-checkbox>

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

			<modal-item @click="marketStore.resetAll"> Reset all changes </modal-item>

			<ui-driver />

			<modal-item @click="emit('delete')"> Delete </modal-item>
		</template>

		<modal-item>Delete</modal-item>
	</modal-rcm>
</template>
