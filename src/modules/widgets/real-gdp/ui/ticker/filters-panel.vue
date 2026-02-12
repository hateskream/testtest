<script setup lang="ts">
import { computed } from 'vue';

import { ModalBadgeFilter, WidgetFiltersScrollable } from '@/modules/widgets/base';
import { type RealGdpValueTypeType, valueTypeFilters, valueTypeFilterValueToDisplay } from '../../model';

const emit = defineEmits<{
	reset: [];
}>();

const activeValueType = defineModel<RealGdpValueTypeType>('valueType', { required: true });

const activeValueTypeLabel = computed(() => valueTypeFilterValueToDisplay[activeValueType.value]);
</script>

<template>
	<widget-filters-scrollable
		display-variant="new"
		@on-clear-click="emit('reset')"
	>
		<modal-badge-filter
			display-variant="new"
			:options="valueTypeFilters"
			:selected-value="activeValueType"
			:label="activeValueTypeLabel"
			close-on-select
			title="Value Type"
			@select="activeValueType = $event.value"
		/>
	</widget-filters-scrollable>
</template>
