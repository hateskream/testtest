<script setup lang="ts">
import { computed } from 'vue';

import { decodeTickerId } from '@/modules/cell';
import type { Sectors } from '../../../model';
import { DoughnutChart } from '../common';

interface IProps {
	data: Sectors;
}

const props = defineProps<IProps>();

const chartLabel = computed(() => decodeTickerId(props.data.tickerId)?.tickerId);
</script>
<template>
	<div :class="classes.view">
		<doughnut-chart
			:class="classes.chart"
			:sectors="props.data.sectors"
			:label="chartLabel"
		/>
	</div>
</template>

<style module="classes">
.view {
	display: flex;
	justify-content: center;
	width: 100%;
}

.chart {
	height: 310px;
	padding: 30px 40px 40px;
}
</style>
