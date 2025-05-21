<script setup lang="ts">
// Import the components (adjust paths as needed for your project)
import { ChartWidgetLayout } from '@/modules/chart/components/widgets/common/layouts';

import { ref } from 'vue';
import RangeLine from "@/modules/chart/components/widgets/range/components/range-line.vue";


// Track the selected period at the parent level
const selectedPeriod = ref('1M');

// Example data
const rangeData = {
	'1D': {
		min: 212.34,
		max: 262.53,
		current: 242.50,
		start: 230.15, // Price increased from start
		symbol: '$'
	},
	'1W': {
		min: 198.76,
		max: 275.90,
		current: 242.50,
		start: 250.80, // Price decreased from start
		symbol: '$'
	},
	'1M': {
		min: 185.30,
		max: 290.45,
		current: 242.50,
		start: 195.60, // Price increased from start
		symbol: '$'
	},
	'3M': {
		min: 175.20,
		max: 300.10,
		current: 242.50,
		start: 280.75, // Price decreased from start
		symbol: '$'
	},
	'1Y': {
		min: 150.80,
		max: 310.25,
		current: 242.50,
		start: 160.40, // Price increased from start
		symbol: '$'
	}
};

// Handle period changes
const handlePeriodChange = (period: string) => {
	console.log('Period changed to:', period);
	// You could perform additional actions here when the period changes
};
</script>

<template>
	<chart-widget-layout>
		"
		<template #header>
			<span>Pricer Performance</span>
			<div class="current-period">
				Currently viewing: {{ selectedPeriod }}
			</div>
		</template>
		<template #body>
			<range-line
				v-model="selectedPeriod"
				:data="rangeData"
				@update:modelValue="handlePeriodChange"
			/>
		</template>
	</chart-widget-layout>
</template>

<style scoped>
.current-period {
	font-size: 12px;
	color: #aaa;
	margin-top: 4px;
}
</style>
