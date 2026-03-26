<script setup lang="ts">
import { computed } from 'vue';
import { useNow } from '@vueuse/core';

import { ModalBadgeFilter, WidgetFiltersScrollable } from '@/modules/widgets/base';
import { getDateFormatter } from '@/shared/lib';
import {
	getTimezoneUtcLabel,
	timeZoneUtcFilters,
	timezoneUtcToIntl,
	type TimezoneUtcType,
} from '@/modules/charts/common/model';

const emit = defineEmits<{
	reset: [];
}>();

interface IFiltersPanelProps {
	displayVariant: 'default' | 'new';
}

const props = defineProps<IFiltersPanelProps>();

const activeTimezone = defineModel<TimezoneUtcType>('timezone', { required: true });

const now = useNow({ interval: 60_000 });

const timezoneLabel = computed(() => {
	const formatter = getDateFormatter({
		timeZone: timezoneUtcToIntl(activeTimezone.value),
		hour: 'numeric',
		minute: '2-digit',
		hourCycle: 'h23',
	});

	return `${formatter.format(now.value)} (${getTimezoneUtcLabel(activeTimezone.value)})`;
});
</script>

<template>
	<widget-filters-scrollable
		:display-variant="props.displayVariant"
		@on-clear-click="emit('reset')"
	>
		<modal-badge-filter
			:display-variant="props.displayVariant"
			:options="timeZoneUtcFilters"
			:selected-value="activeTimezone"
			:label="timezoneLabel"
			close-on-select
			title="Time zone"
			@select="activeTimezone = $event.value"
		/>
	</widget-filters-scrollable>
</template>
