<script setup lang="ts">
import { type Period } from '@/modules/widgets/altcoinSeason/model/altcoin-season.model';

interface IAltcoinSeasonPeriodGroupProps {
	period: Period;
}

const props = defineProps<IAltcoinSeasonPeriodGroupProps>();

// TODO: get from API
const periods = ['7D', '30D', '90D', '1Y'];

</script>

<template>
	<div :class="classes.altcoinSeasonPeriodGroup">
		<div
			v-for="periodItem in periods"
			:key="periodItem"
			:class="[classes.periodItem, { [classes.active]: periodItem === props.period }]"
		>
			<span :class="classes.periodItemText">
				{{ periodItem }}
			</span>
		</div>
	</div>
</template>

<style module="classes">
.altcoinSeasonPeriodGroup {
	display: flex;
	align-items: center;
	width: 283px;
	padding: 2px;
	background: var(--color-metrics-bg-control-300, rgb(45 45 47 / 40%));
	border-radius: var(--radius-full, 9999px);
}

.periodItem {
	display: flex;
	flex: 1 0 0;
	justify-content: center;
	align-items: center;
	height: 28px;
	padding: 6px 8px;
	border-radius: 16px;
	gap: 6px;
	cursor: pointer;

	&.active {
		background: var(--color-bg-actived-base-300-actived, rgb(51 51 51 / 80%));
	}
}

.periodItemText {
	font-weight: 380;
	font-size: var(--typography-headers-size-h-02, 10px);
	color: var(--color-text-base-300, #9a9a9d);
	letter-spacing: 0.04px;
}
</style>
