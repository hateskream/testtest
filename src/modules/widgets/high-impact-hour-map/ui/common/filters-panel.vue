<script setup lang="ts">
import { computed } from 'vue';
import { useNow } from '@vueuse/core';

import { ModalBadgeFilter, WidgetFiltersScrollable } from '@/modules/widgets/base';
import { timeZoneFilters, timeZoneToDisplay, type TimeZoneUTC } from '../../model';
import { getDateFormatter } from '@/shared/lib';

const emit = defineEmits<{
	reset: [];
}>();

interface IFiltersPanelProps {
	displayVariant: 'default' | 'new';
}

const props = defineProps<IFiltersPanelProps>();

const activeTimezone = defineModel<TimeZoneUTC>('timezone', { required: true });

const now = useNow({ interval: 60_000 });

function prepareTimezone(offset: TimeZoneUTC) {
	let numericOffset = offset.replace('UTC', '').replace('_', ':');

	const isNegative = numericOffset.startsWith('-');

	if (numericOffset.includes(':')) {
		if (isNegative) {
			if (numericOffset.length === 5) {
				return `-0${numericOffset.slice(1)}`;
			}

			return numericOffset;
		}

		if (numericOffset.length === 4) {
			return `+0${numericOffset}`;
		}

		return numericOffset;
	}

	if (isNegative) {
		if (numericOffset.length === 2) {
			return `-0${numericOffset.slice(1)}`;
		}

		return numericOffset;
	}

	if (numericOffset.length === 1) {
		return `+0${numericOffset}`;
	}

	return `+${numericOffset}`;
}

const timezoneLabel = computed(() => {
	const formatter = getDateFormatter({
		timeZone: prepareTimezone(activeTimezone.value),
		hour: 'numeric',
		minute: '2-digit',
		hourCycle: 'h23',
	});

	return `${formatter.format(now.value)} (${timeZoneToDisplay[activeTimezone.value]})`;
});
</script>

<template>
	<widget-filters-scrollable
		:display-variant="props.displayVariant"
		@on-clear-click="emit('reset')"
	>
		<modal-badge-filter
			:display-variant="props.displayVariant"
			:options="timeZoneFilters"
			:selected-value="activeTimezone"
			:label="timezoneLabel"
			close-on-select
			title="Time zone"
			@select="activeTimezone = $event.value"
		/>
	</widget-filters-scrollable>
</template>
