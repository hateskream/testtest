<script setup lang="ts">
import { computed } from 'vue';

import { getActiveColorByRank, getSeasonNameByRank } from '@/modules/widgets/altcoinSeason/const';
import { useAltcoinSeasonStore } from '@/modules/widgets/altcoinSeason/stores';

import InfoTooltip from '@/shared/ui/info-tooltip/info-tooltip.vue';

const altcoinSeasonStore = useAltcoinSeasonStore();

const btcRank = computed(() => altcoinSeasonStore.widgetData.value.performanceRank?.btcRank);
const maxRank = computed(() => altcoinSeasonStore.widgetData.value.performanceRank?.maxRank);
</script>

<template>
	<div :class="classes.btcPerformanceRankSeason">
		<div :class="classes.rank">
			<span :class="classes.rankValue">{{ btcRank }}</span>
			<span>/{{ maxRank }}</span>
			<info-tooltip text="Bitcoin current score" />
		</div>

		<div :class="classes.seasonLabel" :style="{ color: getActiveColorByRank(btcRank || 0) }">
			{{ getSeasonNameByRank(btcRank || 0) }}
		</div>
	</div>
</template>

<style module="classes">
.btcPerformanceRankSeason {
	display: inline-flex;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
}

.rank {
	display: inline-flex;
	align-items: center;
	font-weight: 440;
	font-size: var(--typography-paragraph-size-p-02, 10px);
	gap: 2px;
	letter-spacing: 0.08px;
}

.rankValue {
	font-weight: 340;
	font-size: var(--typography-headers-size-h02, 24px);
	line-height: 150%;
	color: var(--color-text-base-500, #ffffff);
}

.seasonLabel {
	padding: 8px 12px;
	font-weight: 440;
	font-size: 12px;
	letter-spacing: 0.096px;
	background: var(--color-metrics-bg-control-300, rgb(45 45 47 / 40%));
	border-radius: 9999px;
}
</style>
