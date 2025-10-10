<script setup lang="ts">
import { UiPosition } from '@/shared/ui/position';
import { MarketBadgeList, ModalBadgeList, ModalItem, ModalItemInteraction } from '../../base';
import type { MarketType } from '@/modules/market';
import type { ITableColumn } from '@/modules/cell';

import TableColumnsSettingsComponent from './table-columns-settings-component.vue';

const market = defineModel<MarketType>('market', { required: true });
const columns = defineModel<ITableColumn[]>('columns', { required: true });
</script>

<template>
	<modal-badge-list>
		<template #title> Filter </template>

		<ui-position
			:position-offset="12"
			trigger="hover"
		>
			<template #title>
				<modal-item-interaction> Categories </modal-item-interaction>
			</template>

			<template #content>
				<market-badge-list v-model="market" title="Categories" />
			</template>
		</ui-position>

		<ui-position
			:position-offset="12"
			trigger="hover"
		>
			<template #title>
				<modal-item-interaction> Editing columns </modal-item-interaction>
			</template>

			<template #content>
				<table-columns-settings-component v-model="columns" />
			</template>
		</ui-position>

		<modal-item> Reset all changes </modal-item>
	</modal-badge-list>
</template>
