<script setup lang="ts">
import { ModalBadgeFilter, WidgetFiltersScrollable } from '@/modules/widgets/base';
import {
	CpiRange,
	CpiValueType,
	rangeFilters,
	rangeFilterValueToDisplay,
	valueTypeFilters,
	valueTypeFilterValueToDisplay,
} from '../../model';

const emit = defineEmits<{
	reset: [];
}>();

interface IFiltersPanelProps {
	isShowRange?: boolean;
	displayVariant: 'default' | 'new';
}

const props = defineProps<IFiltersPanelProps>();

const activeRange = defineModel<CpiRange>('range', { required: true });
const activeValueType = defineModel<CpiValueType>('valueType', { required: true });
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
			:label="valueTypeFilterValueToDisplay[activeValueType]"
			close-on-select
			title="Value Type"
			@select="activeValueType = $event.value"
		/>
		<modal-badge-filter
			v-if="props.isShowRange"
			:display-variant="props.displayVariant"
			:options="rangeFilters"
			:selected-value="activeRange"
			:label="rangeFilterValueToDisplay[activeRange].selected"
			close-on-select
			title="Date range"
			@select="activeRange = $event.value"
		/>
	</widget-filters-scrollable>
</template>
