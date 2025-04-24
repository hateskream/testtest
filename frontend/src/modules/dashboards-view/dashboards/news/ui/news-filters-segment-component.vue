<script setup lang="ts">
import { BaseModalItemCheckbox, BaseModalList } from '../../base';
import { useNewsStore } from '../stores';

const newsFilters = useNewsStore();
</script>

<template>
	<base-modal-list>
		<template #title> Segment </template>

		<template #content>
			<base-modal-item-checkbox
				v-for="filter in newsFilters.filters.segment.list"
				:key="filter.value"
				:model-value="newsFilters.filters.segment.value.includes(filter.value)"
				@update:model-value="newsFilters.toggleFiltersList('segment', filter.value)"
			>
				{{ filter.label }}
			</base-modal-item-checkbox>
		</template>
	</base-modal-list>
</template>
