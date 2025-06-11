<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { ChartCommonTooltip } from '@/modules/chart/components/shared/ui';

interface MarketData {
	marketCap: number; // Raw number like 3252255
	volume: string;
	totalReturn3M: number | string; // Percentage as number or string
	totalReturn1Y: number | string; // Percentage as number or string
	forwardPE: string;
	sector: string;
}

const props = defineProps<{
	marketData: MarketData;
}>();

// Format percentage to 2 decimal places
const formatPercentage = (value: number | string): string => {
	const num = typeof value === 'string' ? parseFloat(value.replace('%', '')) : value;
	return `${num.toFixed(2)}%`;
};

// Format market cap with K, M, B, T suffixes from raw numbers
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

// Usage example:
// <MarketGrid :market-data="{
//   marketCap: 3252255, // → '3.25M'
//   volume: '151 703 351',
//   totalReturn3M: -29.5, // → '-29.50%'
//   totalReturn1Y: 53.95, // → '53.95%'
//   forwardPE: '151 703 351',
//   sector: 'Automobiles'
// }" />
//
// Examples of number formatting:
// 3252255 → '3.25M' (millions)
// 920810000000 → '920.81B' (billions)
// 1250500000000000 → '1.25T' (trillions)
// 5500 → '5.50K' (thousands)
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
			<a
				:class="classes.sectorLink"
				href="https://google.com"
				target="_blank"
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
			</a>
		</div>
	</div>
</template>

<style module="classes">
.wrapper {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 6px;
	padding: 3px;
	color: white;
	max-width: 100%;
}

.gridItem {
	background: var(--metrics-bg-temp);
	padding: 10px 16px;
	border-radius: 12px;
	display: flex;
	flex-direction: column;
	gap: 1px;
	align-items: center;
}

.sector {
	padding: 3px 9px;
	flex-direction: row;
	justify-content: space-between;
}

.sectorTitle {
	line-height: 20px;
}

.sectorLink {
	display: flex;
	gap: 4px;
	color: var(--text-color-base-300);
	transition: all .2s ease-in-out;
	cursor: pointer;

	&:hover {
		color: var(--text-color-base-500);
	}
}

.iconWrapper {
	border-radius: 9999px;
	background-color: var(--metrics-bg-control-300);
	display: flex;
	align-items: center;
	justify-content: center;
	height: 30px;
	width: 30px;
	position: relative;
}

.icon {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}

.sectorName {
	border-radius: 9999px;
	background-color: var(--metrics-bg-control-300);
	display: flex;
	align-items: center;
	justify-content: center;
	height: 30px;
	padding: 5px 11px;
}

.span2 {
	grid-column: span 2;
}

.span1 {
	grid-column: span 1;
}

.metricLabel {
	color: var(--text-color-base-300);
	line-height: 17px;
	display: flex;
	gap: 3px;
	align-items: center;
}

.metricValue {
	line-height: 26px;
	color: var(--text-color-base-500);
}
</style>
