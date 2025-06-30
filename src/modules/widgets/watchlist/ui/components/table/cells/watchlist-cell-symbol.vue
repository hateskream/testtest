<script setup lang="ts">
import type { IWatchlistSymbolCell } from '../../../../model';
import { tickerIcon, forexTickerIcon } from '@/shared/ui/ticker';

interface IProps {
	cell: IWatchlistSymbolCell;
	tickerState: {
		isShowLogo: boolean;
		isShowTicker: boolean;
		isShowDescription: boolean;
	};
}

const props = defineProps<IProps>();
</script>

<template>
	<div :class="classes.tableIcon">
		<!-- Crypto, Stock, Commodity, Index symbols -->
		<ticker-icon
			v-if="props.cell.symbolType !== 'Forex' && props.cell.srcImg && props.tickerState.isShowLogo"
			:src="props.cell.srcImg"
			:ticker="props.cell.ticker || ''"
			:size="32"
		/>

		<!-- Forex symbols -->
		<forex-ticker-icon
			v-if="props.cell.symbolType === 'Forex'
				&& props.cell.leftSrcImg
				&& props.cell.rightSrcImg
				&& props.tickerState.isShowLogo"
			:src="[props.cell.leftSrcImg, props.cell.rightSrcImg]"
			:ticker="`${props.cell.leftTicker}/${props.cell.rightTicker}`"
			:domain="`${props.cell.leftTicker}/${props.cell.rightTicker}`"
			:size="40"
		/>

		<div :class="classes.tickerName">
			<!-- Show ticker for all types -->
			<span v-if="props.tickerState.isShowTicker && props.cell.ticker">
				{{ props.cell.ticker }}
			</span>

			<!-- Show Forex pair for Forex -->
			<span
				v-if="props.cell.symbolType === 'Forex'
					&& props.tickerState.isShowTicker
					&& props.cell.leftTicker
					&& props.cell.rightTicker"
			>
				{{ props.cell.leftTicker }}/{{ props.cell.rightTicker }}
			</span>

			<!-- Show description based on symbol type -->
			<span v-if="props.tickerState.isShowDescription" :class="classes.description">
				<template v-if="props.cell.symbolType === 'Index' && props.cell.indexName">
					{{ props.cell.indexName }}
				</template>
				<template v-else-if="props.cell.symbolType === 'Commodity' && props.cell.commodityName">
					{{ props.cell.commodityName }}
				</template>
				<template v-else-if="props.cell.symbolType === 'Stock' && props.cell.companyName">
					{{ props.cell.companyName }}
				</template>
				<template v-else-if="props.cell.symbolType === 'Crypto' && props.cell.blockchain">
					{{ props.cell.blockchain }}
				</template>
				<template
					v-else-if="props.cell.symbolType === 'Forex'
						&& props.cell.leftTicker
						&& props.cell.rightTicker"
				>
					{{ props.cell.leftTicker }}/{{ props.cell.rightTicker }}
				</template>
			</span>
		</div>
	</div>
</template>

<style module="classes">
.tableIcon {
	display: flex;
	align-items: center;
	gap: 8px;
}

.tickerName {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 2px;
}

.description {
	font-size: 11px;
	line-height: 1.2;
	color: var(--text-color-base-300);
}
</style>
