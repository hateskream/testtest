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
		<div v-else :class="classes.labelRow">
			{{name.value}}
			<span :class="classes.dot">·</span>
			<span :class="[classes.additional, sortBy === key && classes.active]">
				{{name.additional}}
			</span>
		</div>
	</modal-item-selector>
</template>

<style module="classes">
.labelRow {
	display: flex;
	align-items: center;
}

.dot {
	margin: 0 6px;
	color: var(--color-text-base-300, #9a9a9d);
}

.additional {
	color: var(--color-text-base-300, #9a9a9d);
}

.additional.active {
	color: var(--color-text-active-base-300-active, #ffffff);
}
</style>
