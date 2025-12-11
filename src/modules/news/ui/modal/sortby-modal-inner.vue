<script setup lang="ts">
import { type SortState, sortToName, toggleSort } from '@/modules/news';
import { ModalItemSelector } from '@/modules/widgets/base';

const sortBy = defineModel<SortState>({ required: true });

function toggleSortBy(sort: SortState) {
	sortBy.value = toggleSort(sortBy.value, sort);
}
</script>

<template>
	<modal-item-selector
		v-for="(name, key) in sortToName"
		:key="key"
		:model-value="sortBy === key"
		@update:model-value="toggleSortBy(key)"
	>
		<template v-if="typeof name === 'string'">
			{{ name }}
		</template>
		<div v-else>
			{{name.value}} · <span :class="[classes.additional, sortBy === key && classes.active]">
				{{name.additional}}
			</span>
		</div>
	</modal-item-selector>
</template>

<style module="classes">
.additional {
	color: var(--color-text-base-300, #9a9a9d);
}

.additional.active {
	color: var(--color-text-active-base-300-active, #ffffff);
}
</style>
