<script setup lang="ts">
import type { IHistoricalValue } from '@/modules/widgets/altcoinSeason/model';

import HistoricalValueData from './historical-value-data.vue';
import AltcoinHeading from '../shared/altcoin-heading.vue';

const props = defineProps<{
	historicalValues: IHistoricalValue;
}>();

</script>

<template>
	<div :class="classes.historicalValue">
		<altcoin-heading>
			Historical values
		</altcoin-heading>
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
