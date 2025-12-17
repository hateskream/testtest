<script setup lang="ts">
import { DATA_CAP, getActiveColorByRank, getSeasonNameByRank } from '@/modules/widgets/altcoinSeason/const';
import type { IPerformanceRank } from '@/modules/widgets/altcoinSeason/model';

import InfoTooltip from '@/shared/ui/info-tooltip/info-tooltip.vue';

const props = defineProps<{
	performance: IPerformanceRank;
}>();
</script>

<template>
	<div :class="classes.btcPerformanceRankSeason">
		<div :class="classes.rank" class="text-200-r">
			<span :class="classes.rankValue">{{ props.performance.btcRank }}</span>
			<span>/{{DATA_CAP}}</span>
			<info-tooltip text="Bitcoin current score" />
		</div>

		<div :class="classes.seasonLabel" :style="{ color: getActiveColorByRank(props.performance.btcRank || 0) }">
			{{ getSeasonNameByRank(props.performance.btcRank || 0) }}
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
	gap: 2px;
}

.rankValue {
	font-weight: 340;
	font-size: var(--font-title-400-size, 24px);
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
