<script setup lang="ts">
import { computed, ref } from 'vue';

import { UiDriver } from '@/shared/ui/driver';
import { UiSearch } from '@/shared/ui/input';
import type { IFilterOption } from '@/modules/screener/base';
import { ModalItemCheckbox } from '@/modules/widgets/base';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiTransitionFade } from '@/shared/ui/transition';

import FilterModalAction from './filter-modal-action.vue';

const modelValue = defineModel<(string | number)[]>({ default: () => [] });

export interface IFilterModalSelectProps {
	searchable?: boolean;
	options?: IFilterOption[];
	searchPlaceholder?: string;
}

const props = withDefaults(defineProps<IFilterModalSelectProps>(), {
	options: () => [],
	searchPlaceholder: 'Search options',
});

const search = ref('');

const filteredOptions = computed(() => {
	if (!props.searchable) {
		return props.options;
	}

	const query = search.value.trim().toLowerCase();

	if (!query.length) {
		return props.options;
	}

	return props.options.filter(option =>
		option.label.toLowerCase().includes(query) ||
		(option.description && option.description.toLowerCase().includes(query)),
	);
});

const modelValuesSet = computed(() => new Set(modelValue.value));

function isSelectedOption(option: IFilterOption) {
	return modelValuesSet.value.has(option.value);
}

const isAllSelectedOptions = computed(() => modelValue.value.length === props.options.length);

function select(option: IFilterOption) {
	if (modelValue.value.includes(option.value)) {
		modelValue.value = modelValue.value.filter(v => v !== option.value);
	} else {
		modelValue.value = [...modelValue.value, option.value];
	}
}

function selectAll() {
	modelValue.value = props.options.map(option => option.value);
}

function clear() {
	modelValue.value = [];
}

const isEmptySearchState = computed(() => search.value.length && !filteredOptions.value.length);
</script>
<template>
	<div>
		<div v-if="searchable" :class="classes.search">
			<ui-search
				v-model="search"
				:placeholder="props.searchPlaceholder"
				:class="classes.searchInput"
				:show-icon="false"
			/>
		</div>
		<modal-item-checkbox
			v-for="option in filteredOptions"
			:key="option.value"
			:model-value="isSelectedOption(option)"
			:class="classes.selector"
			@update:model-value="select(option)"
		>
			<div :class="classes.selectorLabel">
				<span>{{option.label}}</span>
				<template v-if="option.description">
					<span :class="classes.dot">·</span>
					<span :class="classes.description">{{option.description}}</span>
				</template>
			</div>
		</modal-item-checkbox>
		<div v-if="isEmptySearchState" :class="classes.emptyState">
			<ui-icon
				:id="IconIds.Search"
				width="50"
				height="50"
				:class="classes.icon"
			/>
			<p>No metrics match your criteria</p>
		</div>
		<template v-if="!isEmptySearchState">
			<ui-driver />
			<filter-modal-action
				:disabled="isAllSelectedOptions"
				:icon="IconIds.SelectAll"
				label="Select all"
				@click="selectAll"
			/>
			<ui-transition-fade>
				<filter-modal-action
					v-if="modelValue.length"
					:icon="IconIds.Close"
					label="Clear"
					@click="clear"
				/>
			</ui-transition-fade>
		</template>
	</div>
</template>

<style module="classes">
.search {
	margin-bottom: 6px;
	padding: 0 12px;
}

.searchInput {
	border-bottom: 1px solid var(--border-color-base-300);
}

.selector:hover {
	background: var(--metrics-bg-control-300);
}

.selectorLabel {
	display: flex;
	flex-grow: 0;
	flex-wrap: wrap;
	max-width: 100%;
}

.dot {
	margin: 0 5px;
}

.description {
	font-size: 12px;
	color: var(--text-color-base-300);
}

.emptyState {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 10px;
	gap: 10px;
}
</style>
