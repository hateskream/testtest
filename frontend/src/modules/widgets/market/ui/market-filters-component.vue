<script setup lang="ts">
import { UiPosition } from '@/shared/ui/position';
import { ModalBadgeList, ModalItem, ModalItemInteraction } from '../../base';

import MarketFilterCategories from './market-filter-categories-component.vue';
import TableColumnsSettingsComponent from './table-columns-settings-component.vue';
</script>

<template>
	<modal-badge-list>
		<template #title> Filter </template>

		<ui-position
			:position-offset="12"
			trigger="hover"
		>
			<template #default>
				<modal-item-interaction> Categories </modal-item-interaction>
			</template>

			<template #content>
				<market-filter-categories />
			</template>
		</ui-position>

		<ui-position
			:position-offset="12"
			trigger="hover"
		>
			<template #default>
				<modal-item-interaction> Editing columns </modal-item-interaction>
			</template>

			<template #content>
				<table-columns-settings-component />
			</template>
		</ui-position>

		<modal-item> Reset all changes </modal-item>
	</modal-badge-list>
</template>
