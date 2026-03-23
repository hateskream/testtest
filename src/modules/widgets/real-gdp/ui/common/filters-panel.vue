<script setup lang="ts">
import { computed } from 'vue';

import { ModalBadgeFilter, WidgetFiltersScrollable } from '@/modules/widgets/base';
import { getDateRangePresetLabel } from '@/modules/charts/common/model';
import { rangeFilters, type RealGdpDateRangePresetType } from '../../model';

const emit = defineEmits<{
	reset: [];
}>();

interface IFiltersPanelProps {
	displayVariant: 'default' | 'new';
}

const props = defineProps<IFiltersPanelProps>();

const activeRange = defineModel<RealGdpDateRangePresetType>('range', { required: true });

const label = computed(() => getDateRangePresetLabel(activeRange.value));
</script>

<template>
	<widget-filters-scrollable
		:display-variant="props.displayVariant"
		@on-clear-click="emit('reset')"
	>
		<modal-badge-filter
			:display-variant="props.displayVariant"
			:options="rangeFilters"
			:selected-value="activeRange"
			:label="label"
			close-on-select
			title="Date range"
			@select="activeRange = $event.value"
		/>
	</widget-filters-scrollable>
</template>
