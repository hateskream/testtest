<script setup lang="ts">
import { computed } from 'vue';

import { ModalBadgeFilter, WidgetFiltersScrollable } from '@/modules/widgets/base';
import {
	type CpiDateRangePresetType,
	type CpiValueTypeType,
	rangeFilters,
	valueTypeFilters,
	valueTypeFilterValueToDisplay,
} from '../../model';
import { getDateRangePresetLabel } from '@/modules/charts/common/model';

const emit = defineEmits<{
	reset: [];
}>();

interface IFiltersPanelProps {
	isShowRange?: boolean;
	displayVariant: 'default' | 'new';
}

const props = defineProps<IFiltersPanelProps>();

const activeRange = defineModel<CpiDateRangePresetType>('range');
const activeValueType = defineModel<CpiValueTypeType>('valueType', { required: true });

const activeRangeLabel = computed(() => activeRange.value && getDateRangePresetLabel(activeRange.value));
const activeValueTypeLabel = computed(() => valueTypeFilterValueToDisplay[activeValueType.value]);
</script>

<template>
	<widget-filters-scrollable
		:display-variant="props.displayVariant"
		@on-clear-click="emit('reset')"
	>
		<modal-badge-filter
			:display-variant="props.displayVariant"
			:options="valueTypeFilters"
			:selected-value="activeValueType"
			:label="activeValueTypeLabel"
			close-on-select
			title="Value Type"
			@select="activeValueType = $event.value"
		/>
		<modal-badge-filter
			v-if="props.isShowRange && activeRange"
			:display-variant="props.displayVariant"
			:options="rangeFilters"
			:selected-value="activeRange"
			:label="activeRangeLabel"
			close-on-select
			title="Date range"
			@select="activeRange = $event.value"
		/>
	</widget-filters-scrollable>
</template>
