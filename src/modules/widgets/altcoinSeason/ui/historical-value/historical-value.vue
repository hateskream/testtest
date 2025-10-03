<script setup lang="ts">
import type { IHistoricalValue } from '@/modules/widgets/altcoinSeason/model';

import HistoricalValueHeading from './historical-value-heading.vue';
import HistoricalValueData from './historical-value-data.vue';

const props = defineProps<{
	historicalValues: IHistoricalValue;
}>();

</script>

<template>
	<div :class="classes.historicalValue">
		<historical-value-heading  />
		<historical-value-data :historical-values="props.historicalValues" />
	</div>
</template>

<style module="classes">
.historicalValue {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	align-items: flex-start;
	height: 100%;
	min-height: 144px;
	padding: 6px 16px 15px;
	color: var(--color-text-base-300, #9a9a9d);
	gap: 12px;
}

</style>
