<script setup lang="ts">
// oxlint-disable-next-line typescript/ban-ts-comment
// @ts-nocheck
import { computed } from 'vue';

import type { ITableSymbolCell } from '../model';
import { UniversalTickerIcon } from '@/shared/ui/ticker';
import { UiText } from '@/shared/ui/text';

interface IProps {
	data: ITableSymbolCell;
	disableTickerClick?: boolean | undefined;
	tickerState: {
		isShowLogo: boolean;
		isShowTicker: boolean;
		isShowDescription: boolean;
	};
}


const props = defineProps<IProps>();

const emits = defineEmits<{
	(e: 'click-symbol'): void;
}>();

const handleClick = () => {
	if (!props.disableTickerClick) {
		emits('click-symbol');
	}
};

const tickerIcon = computed(() => {
	const { data } = props;

	if (!props.tickerState.isShowLogo) {
		return null;
	}

	if (
		data.symbolType === 'Forex' &&
		data.leftSrcImg &&
		data.rightSrcImg &&
		props.tickerState.isShowLogo
	) {
		const ticker = `${data.leftTicker}/${data.rightTicker}`;

		return {
			symbol: data.symbolType,
			src: [data.leftSrcImg, data.rightSrcImg],
			ticker: ticker,
			domain: ticker,
			size: 20,
		};
	}

	if (
		data.symbolType !== 'Forex' &&
		data.srcImg &&
		props.tickerState.isShowLogo
	) {
		return {
			symbol: data.symbolType,
			src: data.srcImg,
			ticker: data.ticker || '',
			size: 20,
		};
	}

	return null;
});
</script>

<template>
	<div :class="[classes.tableIcon, { [classes.clickable]: !disableTickerClick }]">
		<universal-ticker-icon
			v-if="tickerIcon"
			:symbol-type="tickerIcon.symbol"
			:src="tickerIcon.src?.[0]"
			:right-src="tickerIcon.src?.[1]"
			:size="tickerIcon.size"
			:ticker="tickerIcon.ticker"
		/>

		<div
			v-if="props.data.symbolType === 'PlainText'
				&& props.data.text"
			:class="[classes.text, 'symbolCellText']"
			@click="handleClick"
		>
			{{ props.data.text }}
		</div>

		<div
			:class="[classes.tickerName, { [classes.clickable]: !disableTickerClick }]"
			@click="handleClick"
		>
			<!-- Show ticker for all types -->
			<ui-text
				v-if="props.tickerState.isShowTicker && props.data.ticker"
				token="text-300-r"
			>
				{{ props.data.ticker }}
			</ui-text>

			<!-- Show Forex pair for Forex -->
			<ui-text
				v-if="props.data.symbolType === 'Forex'
					&& props.tickerState.isShowTicker
					&& props.data.leftTicker
					&& props.data.rightTicker"
				token="text-300-r"
			>
				{{ props.data.leftTicker }}/{{ props.data.rightTicker }}
			</ui-text>

			<!-- Show description based on symbol type -->
			<ui-text
				v-if="props.tickerState.isShowDescription"
				:class="classes.description"
				token="text-300-r"
			>
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
			</ui-text>
		</div>
	</div>
</template>

<style module="classes">
.tableIcon {
	display: flex;
	align-items: center;
	gap: 8px;
}

.tableIcon.clickable {
	cursor: pointer;
}

.tickerName {
	display: flex;
	align-items: center;
	gap: 6px;
}

.tickerName.clickable {
	cursor: pointer;
}

.tickerName.clickable :first-child:hover {
	text-decoration: underline;
}

.description {
	color: var(--text-color-base-300);
}

.text {
	color: var(--text-color-base-500);
}
</style>
