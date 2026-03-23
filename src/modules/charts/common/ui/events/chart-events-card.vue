<script setup lang="ts">
import { computed } from 'vue';

import type { ICalendarEventMetric } from '@/modules/calendar';
import { UiText } from '@/shared/ui/text';

import ChartEventsCardRow from './chart-events-card-row.vue';

interface IProps {
	title: string;
	datetime: string;
	metrics: ICalendarEventMetric[];
}

const props = defineProps<IProps>();

const formattedDate = computed(() => {
	return new Date(Date.parse(props.datetime)).toLocaleString();
});

</script>

<template>
	<div :class="classes.card">
		<div :class="classes.header">
			<ui-text token="text-200-r">{{props.title}}</ui-text>
		</div>
		<div :class="classes.column">
			<chart-events-card-row
				v-for="metric in props.metrics"
				:key="metric.label"
				:name="metric.label"
				:value="metric.value"
			/>
			<ui-text
				token="text-100-r"
				as="p"
				:class="classes.date"
			>
				{{formattedDate}}
			</ui-text>
		</div>
	</div>
</template>

<style module="classes">
.card {
	display: flex;
	flex-direction: column;
}

.header {
	display: flex;
	align-items: center;
	padding:
		var(--padding-padding-s6, 10px)
		var(--padding-padding-s8, 14px)
		var(--padding-padding-s4, 6px)
		var(--padding-padding-s8, 14px);
}

.date {
	color: var(--text-300, rgb(255 255 255 / 62%));
}

.column {
	display: flex;
	flex-direction: column;
	padding:
		var(--padding-padding-s4, 6px)
		var(--padding-padding-s8, 14px)
		var(--padding-padding-s6, 10px)
		var(--padding-padding-s8, 14px);
	border-top: 1px solid rgb(73 73 80 / 32%);
	gap: 2px;
}
</style>
