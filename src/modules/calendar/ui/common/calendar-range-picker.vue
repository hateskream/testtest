<script setup lang="ts">
import { computed } from 'vue';

import { UiDatePicker, type DatePickerRangeObject } from '@/shared/ui/date-picker';
import { localDateToUTCUnix } from '../../utils/event-board-utils';

const model = defineModel<{ from: number; to: number }>({
	required: true,
});

const range = computed<DatePickerRangeObject>({
	get() {
		const fromDate = new Date(model.value.from * 1000);
		const toDate = new Date(model.value.to * 1000);
		return {
			start: new Date(fromDate.getUTCFullYear(), fromDate.getUTCMonth(), fromDate.getUTCDate()),
			end: new Date(toDate.getUTCFullYear(), toDate.getUTCMonth(), toDate.getUTCDate()),
		};
	},
	set(value) {
		model.value = {
			from: localDateToUTCUnix(new Date(value.start as number | string | Date)),
			to: localDateToUTCUnix(new Date(value.end as number | string | Date)),
		};
	},
});
</script>

<template>
	<ui-date-picker
		v-model="range"
		view="weekly"
		is-range
	/>
</template>

<style module="classes">
</style>
