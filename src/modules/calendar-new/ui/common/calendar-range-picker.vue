<script setup lang="ts">
import { computed } from 'vue';

import { UiDatePicker, type DatePickerRangeObject } from '@/shared/ui/date-picker';
import { toUTCMidnightUnix } from '../../utils/event-board-utils';

const model = defineModel<{ from: number; to: number }>({
	required: true,
});

const range = computed<DatePickerRangeObject>({
	get() {
		return {
			start: new Date(model.value!.from * 1000),
			end: new Date(model.value!.to * 1000),
		};
	},
	set(value) {
		model.value = {
			from: toUTCMidnightUnix(new Date(value.start as number | string | Date)),
			to: toUTCMidnightUnix(new Date(value.end as number | string | Date)),
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
