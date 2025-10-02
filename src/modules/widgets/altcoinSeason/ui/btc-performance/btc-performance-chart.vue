<script setup lang="ts">
import { computed } from 'vue';

import { widgetActiveColor, widgetColor } from '@/modules/widgets/altcoinSeason/const';
import { useAltcoinSeasonStore } from '@/modules/widgets/altcoinSeason/stores';

const altcoinSeasonStore = useAltcoinSeasonStore();

const activeBar = computed(() => altcoinSeasonStore.widgetData.value.performanceRank?.btcRank);
const maxRank = computed(() => altcoinSeasonStore.widgetData.value.performanceRank?.maxRank);
</script>

<template>
	<div :class="classes.btcPerformanceChart">
		<div :class="classes.chart">
			<div
				v-for="i in maxRank"
				:key="i"
				:class="classes.chartBar"
			>
				<div v-if="i === activeBar || i === 1 || i === maxRank" :class="classes.barIndex">{{ i }}</div>
				<div
					v-if="i === activeBar"
					:class="classes.barIndex"
					:style="{
						color:
							i <= 7
								? widgetActiveColor.bitcoinSeason
								: i <= 23
									? widgetActiveColor.neutralSeason
									: widgetActiveColor.altcoinSeason,
					}"
				>{{ i }}</div>
				<div
					v-if="i !== activeBar"
					:class="[classes.bar, {[classes.active]: i === activeBar}]"
					:style="{
						backgroundColor:
							i <= 7
								? widgetColor.bitcoinSeason
								: i <= 23
									? widgetColor.neutralSeason
									: widgetColor.altcoinSeason,
					}"
				/>
				<div
					v-else-if="i === activeBar"
					:class="[classes.bar, {[classes.active]: i === activeBar}]"
					:style="{
						backgroundColor:
							i <= 7
								? widgetActiveColor.bitcoinSeason
								: i <= 23
									? widgetActiveColor.neutralSeason
									: widgetActiveColor.altcoinSeason,
					}"
				/>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.btcPerformanceChart {
	display: flex;
	align-self: stretch;
	padding: 0 8px;
}

.chart {
	display: flex;
	flex-grow: 1;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
	padding: 1px 0;
}

.chartBar {
	position: relative;
}

.barIndex {
	position: absolute;
	top: 0;
	left: 50%;
	font-weight: 440;
	font-size: var(--typography-paragraph-size-p-02, 10px);
	color: var(--color-text-base-100, #646568);
	letter-spacing: 0.08px;
	transform: translateX(-50%);
}

.bar {
	width: 1px;
	height: 13px;
	margin-top: 20px;
	background: rgb(77 77 77 / 40%);

	&.active {
		width: 2px;
		height: 17px;
		border-radius: 10px;
	}
}

</style>
