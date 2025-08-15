<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { ChartCommonTooltip } from '@/modules/chart/components/shared/ui';
import { RouteNames } from '@/types/route.d';

interface IKeyStatsProps {
	marketCap: number;
	volume: string;
	totalReturn3M: number | string;
	totalReturn1Y: number | string;
	forwardPE: string;
	sector: string;
}

const props = defineProps<{
	marketData: IKeyStatsProps;
}>();

// Format percentage to 2 decimal places
const formatPercentage = (value: number | string): string => {
	const num = typeof value === 'string' ? parseFloat(value.replace('%', '')) : value;
	return `${num.toFixed(2)}%`;
};

const formatMarketCap = (value: number | string): string => {
	const num = typeof value === 'string' ? parseFloat(value) : value;

	if (num >= 1_000_000_000_000) {
		return `${(num / 1_000_000_000_000).toFixed(2)}T`;
	} else if (num >= 1_000_000_000) {
		return `${(num / 1_000_000_000).toFixed(2)}B`;
	} else if (num >= 1_000_000) {
		return `${(num / 1_000_000).toFixed(2)}M`;
	} else if (num >= 1_000) {
		return `${(num / 1_000).toFixed(2)}K`;
	}
	return num.toString();
};

</script>

<template>
	<div :class="classes.wrapper">

		<div :class="[classes.gridItem, classes.span2]">
			<div :class="classes.metricLabel" class="paragraph-p-02">
				<span>Market Cap</span>
				<chart-common-tooltip />

			</div>
			<div :class="classes.metricValue" class="header-h00">
				{{ formatMarketCap(props.marketData.marketCap) }}
			</div>
		</div>


		<div :class="[classes.gridItem, classes.span1]">
			<div :class="classes.metricLabel" class="paragraph-p-02">
				<span>Volume</span>
				<chart-common-tooltip />
			</div>
			<div :class="classes.metricValue" class="header-h00">
				{{ props.marketData.volume }}
			</div>
		</div>
		<div :class="[classes.gridItem, classes.span1]">
			<div :class="classes.metricLabel" class="paragraph-p-02">
				<span>Total Return (3M)</span>
				<chart-common-tooltip />
			</div>
			<div :class="classes.metricValue" class="header-h00">
				{{ formatPercentage(props.marketData.totalReturn3M) }}
			</div>
		</div>

		<div :class="[classes.gridItem, classes.span1]">
			<div :class="classes.metricLabel" class="paragraph-p-02">
				<span>Total Return (1Y)</span>
				<chart-common-tooltip />
			</div>
			<div :class="classes.metricValue" class="header-h00">
				{{ formatPercentage(props.marketData.totalReturn1Y) }}
			</div>
		</div>
		<div :class="[classes.gridItem, classes.span1]">
			<div :class="classes.metricLabel" class="paragraph-p-02">
				<span>
					Forward P/E
				</span>
				<chart-common-tooltip />
			</div>
			<div :class="classes.metricValue" class="header-h00">{{ props.marketData.forwardPE }}</div>
		</div>


		<div :class="[classes.gridItem, classes.sector, classes.span2]">
			<div :class="classes.sectorTitle" class="paragraph-p-02">Sector</div>
			<router-link
				:class="classes.sectorLink"
				:to="{name:RouteNames.Test}"
				class="header-h00"
			>
				<span :class="classes.sectorName" class="paragraph-p-01">
					{{
						props.marketData.sector
					}}
				</span>
				<span :class="classes.iconWrapper">
					<ui-icon
						:id="IconIds.ArrowToTopRight"
						width="12"
						height="12"
						:class="classes.icon"
					/>
				</span>
			</router-link>
		</div>
	</div>
</template>

<style module="classes">
.wrapper {
	display: grid;
	max-width: 100%;
	padding: 3px;
	color: var(--text-color-base-500);
	grid-template-columns: 1fr 1fr;
	gap: 6px;
}

.gridItem {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 10px 16px;
	background: var(--metrics-bg-temp);
	border-radius: 12px;
	gap: 1px;
}

.sector {
	flex-direction: row;
	justify-content: space-between;
	padding: 3px 9px;
}

.sectorTitle {
	line-height: 20px;
}

.sectorLink {
	display: flex;
	color: var(--text-color-base-300);
	cursor: pointer;
	transition: all 0.2s ease-in-out;
	gap: 4px;

	&:hover {
		color: var(--text-color-base-500);
	}
}

.iconWrapper {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 30px;
	height: 30px;
	background-color: var(--metrics-bg-control-300);
	border-radius: 9999px;
}

.icon {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.sectorName {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 30px;
	padding: 5px 11px;
	background-color: var(--metrics-bg-control-300);
	border-radius: 9999px;
}

.span2 {
	grid-column: span 2;
}

.span1 {
	grid-column: span 1;
}

.metricLabel {
	display: flex;
	align-items: center;
	line-height: 17px;
	color: var(--text-color-base-300);
	gap: 3px;
}

.metricValue {
	line-height: 26px;
	color: var(--text-color-base-500);
}
</style>
