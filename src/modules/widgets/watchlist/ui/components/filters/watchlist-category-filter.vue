<script setup lang="ts">
import { ModalBadgeList, ModalItemSelector } from '../../../../base';
import { useWatchlistStore } from '../../../stores';

const watchlistStore = useWatchlistStore();
</script>

<template>
	<modal-badge-list>
		<template #title> Категории </template>

		<modal-item-selector
			v-for="item in watchlistStore.filterCategories"
			:key="item.value"
			:model-value="item.isSelect"
			@update:model-value="watchlistStore.toggleFilterCategory(item.value)"
		>
			{{ item.name }}
		</modal-item-selector>
	</modal-badge-list>
</template>
