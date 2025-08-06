<script setup lang="ts">
import { computed } from 'vue';

import { getActiveColorByRank } from '@/modules/widgets/altcoinSeason/const';
import { useAltcoinSeasonStore } from '@/modules/widgets/altcoinSeason/stores';

const altcoinSeasonStore = useAltcoinSeasonStore();

const historicalValues = computed(() => altcoinSeasonStore.widgetData.value.historicalValues);

</script>

<template>
	<div :class="classes.historicalValueData">
		<div :class="classes.dataItem">
			<div :class="classes.dataItemTitle">Today</div>
			<div
				:class="classes.dataItemValue"
				:style="{ color: getActiveColorByRank(historicalValues?.today || 0) }"
			>{{ historicalValues?.today }}</div>
		</div>
		<div :class="classes.dataItem">
			<div :class="classes.dataItemTitle">Last week</div>
			<div
				:class="classes.dataItemValue"
				:style="{ color: getActiveColorByRank(historicalValues?.lastWeek || 0) }"
			>{{ historicalValues?.lastWeek }}</div>
		</div>
		<div :class="classes.dataItem">
			<div :class="classes.dataItemTitle">Last month</div>
			<div
				:class="classes.dataItemValue"
				:style="{ color: getActiveColorByRank(historicalValues?.lastMonth || 0) }"
			>{{ historicalValues?.lastMonth }}</div>
		</div>
	</div>
</template>

<style module="classes">
.historicalValueData {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-self: stretch;
	height: 100%;
}

.dataItem {
	display: inline-flex;
	justify-content: space-between;
	align-self: stretch;
	font-weight: 440;
	font-size: var(--typography-paragraph-size-p-01, 12px);
	color: var(--color-text-base-300, #9a9a9d);
	letter-spacing: 0.096px;
}
</style>
