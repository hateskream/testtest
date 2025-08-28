<script setup lang="ts">
import HistoricalValueHeading from './historical-value-heading.vue';
import HistoricalValueData from './historical-value-data.vue';

interface IHistoricalValueProps {
	showPeriod: boolean;
}

const props = defineProps<IHistoricalValueProps>();
</script>

<template>
	<div :class="classes.historicalValue">
		<historical-value-heading :show-period="props.showPeriod" />
		<historical-value-data />
	</div>
</template>

<style module="classes">
.historicalValue {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	align-items: flex-start;
	height: 100%;
	padding: 12px 8px;
	color: var(--color-text-base-300, #9a9a9d);
	gap: 12px;
}

</style>
