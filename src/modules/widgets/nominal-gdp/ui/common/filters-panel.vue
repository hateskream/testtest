<script setup lang="ts">
import { ModalBadgeFilter, WidgetFiltersScrollable } from '@/modules/widgets/base';
import { NominalGdpRange, rangeFilters, rangeFilterValueToDisplay } from '../../model';

const emit = defineEmits<{
	reset: [];
}>();

interface IFiltersPanelProps {
	displayVariant: 'default' | 'new';
}

const props = defineProps<IFiltersPanelProps>();

const activeRange = defineModel<NominalGdpRange>('range', { required: true });
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
			:label="rangeFilterValueToDisplay[activeRange].selected"
			close-on-select
			title="Date range"
			@select="activeRange = $event.value"
		/>
	</widget-filters-scrollable>
</template>
