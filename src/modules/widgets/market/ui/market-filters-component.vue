<script setup lang="ts">
import { MarketBadgeList, ModalBadgeList, ModalItem, ModalSubmenu } from '../../base';
import type { MarketType } from '@/modules/market';
import type { ITableColumn } from '@/modules/cell';

import TableColumnsSettingsComponent from './table-columns-settings-component.vue';

const market = defineModel<MarketType>('market', { required: true });
const columns = defineModel<ITableColumn[]>('columns', { required: true });
</script>

<template>
	<modal-badge-list>
		<template #title> Filter </template>

		<modal-submenu
			:position-offset="12"
			trigger="hover"
		>
			<template #title>
				Categories
			</template>

			<template #content>
				<market-badge-list v-model="market" title="Categories" />
			</template>
		</modal-submenu>

		<modal-submenu
			:position-offset="12"
			trigger="hover"
		>
			<template #title>
				Editing columns
			</template>

			<template #content>
				<table-columns-settings-component v-model="columns" />
			</template>
		</modal-submenu>

		<modal-item> Reset all changes </modal-item>
	</modal-badge-list>
</template>
