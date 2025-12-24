<script setup lang="ts">
import type { IHighImpactHourMapDomain } from '../../model';

import ChartComponent from './chart-component.vue';
import NextEvent from './next-event.vue';

const emit = defineEmits<{
	'click-on-bar': [hours: number[]];
}>();

interface IProps {
	data: IHighImpactHourMapDomain;
}

const props = defineProps<IProps>();
</script>

<template>
	<div :class="classes.container">
		<next-event
			v-if="props.data.nextEvent"
			:timezone="props.data.timezone"
			:event="props.data.nextEvent"
		/>
		<chart-component
			:class="classes.chart"
			:data="props.data"
			@click-on-bar="emit('click-on-bar', $event)"
		/>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	padding: 32px 20px 12px;
	gap: 12px;
}

.chart {
	flex-grow: 1;
}
</style>
