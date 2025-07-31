<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import type { ITableSymbolCell } from '../model';
import { tickerIcon, forexTickerIcon } from '@/shared/ui/ticker';

interface IProps {
	data: ITableSymbolCell;
	tickerState: {
		isShowLogo: boolean;
		isShowTicker: boolean;
		isShowDescription: boolean;
	};
}

// {
//   "symbolType": "Crypto",
//   "srcImg": "http://localhost:5173/src/assets/images/currency/ADA.png",
//   "ticker": "ADA",
//   "blockchain": "Cardano"
// }

const props = defineProps<IProps>();
// const { data: props } = toRefs(propses);
</script>

<template>
	<div :class="classes.tableIcon">
		<!-- Crypto, Stock, Commodity, Index symbols -->
		<ticker-icon
			v-if="props.data.symbolType !== 'Forex' && props.data.srcImg && props.tickerState.isShowLogo"
			:src="props.data.srcImg"
			:ticker="props.data.ticker || ''"
			:size="32"
		/>

		<!-- Forex symbols -->
		<forex-ticker-icon
			v-if="props.data.symbolType === 'Forex'
				&& props.data.leftSrcImg
				&& props.data.rightSrcImg
				&& props.tickerState.isShowLogo"
			:src="[props.data.leftSrcImg, props.data.rightSrcImg]"
			:ticker="`${props.data.leftTicker}/${props.data.rightTicker}`"
			:domain="`${props.data.leftTicker}/${props.data.rightTicker}`"
			:size="40"
		/>

		<div :class="classes.tickerName">
			<!-- Show ticker for all types -->
			<span v-if="props.tickerState.isShowTicker && props.data.ticker">
				{{ props.data.ticker }}
			</span>

			<!-- Show Forex pair for Forex -->
			<span
				v-if="props.data.symbolType === 'Forex'
					&& props.tickerState.isShowTicker
					&& props.data.leftTicker
					&& props.data.rightTicker"
			>
				{{ props.data.leftTicker }}/{{ props.data.rightTicker }}
			</span>

			<!-- Show description based on symbol type -->
			<span v-if="props.tickerState.isShowDescription" :class="classes.description">
				<template v-if="props.data.symbolType === 'Index' && props.data.indexName">
					{{ props.data.indexName }}
				</template>
				<template v-else-if="props.data.symbolType === 'Commodity' && props.data.commodityName">
					{{ props.data.commodityName }}
				</template>
				<template v-else-if="props.data.symbolType === 'Stock' && props.data.companyName">
					{{ props.data.companyName }}
				</template>
				<template v-else-if="props.data.symbolType === 'Crypto' && props.data.blockchain">
					{{ props.data.blockchain }}
				</template>
				<template
					v-else-if="props.data.symbolType === 'Forex'
						&& props.data.leftTicker
						&& props.data.rightTicker"
				>
					{{ props.data.leftTicker }}/{{ props.data.rightTicker }}
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
