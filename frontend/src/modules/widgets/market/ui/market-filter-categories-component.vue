<script setup lang="ts">
import { ModalBadgeList, ModalItemSelector } from '../../base';
import { useMarketStore } from '../stores';

const marketStore = useMarketStore();
</script>

<template>
	<modal-badge-list>
		<template #title> Categories </template>

		<modal-item-selector
			v-for="item in marketStore.filterCategories"
			:key="item.value"
			:model-value="item.isSelect"
			@update:model-value="marketStore.toggleFilterCategory(item.value)"
		>
			{{ item.name }}
		</modal-item-selector>
	</modal-badge-list>
</template>
