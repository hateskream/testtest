<script setup lang="ts">
import { ModalBadgeFilter, WidgetFiltersScrollable } from '@/modules/widgets/base';
import {
	CpiMetric,
	CpiRange,
	metricFilters,
	metricFilterValueToDisplay,
	rangeFilters,
	rangeFilterValueToDisplay,
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
const activeMetric = defineModel<CpiMetric>('metric', { required: true });
</script>

<template>
	<widget-filters-scrollable
		:display-variant="props.displayVariant"
		@on-clear-click="emit('reset')"
	>
		<modal-badge-filter
			:display-variant="props.displayVariant"
			:options="metricFilters"
			:selected-value="activeMetric"
			:label="metricFilterValueToDisplay[activeMetric]"
			close-on-select
			title="CPI"
			@select="activeMetric = $event.value"
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
