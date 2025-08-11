<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import { usePriceStore } from '../stores';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import MockChart from '@/assets/images/mock/chart.svg';
import { UiTransitionFade } from '@/shared/ui/transition';
import { forexTickerIcon, tickerIcon } from '@/shared/ui/ticker';
import type { IMeta } from '@/modules/dashboard-group/core';
import type { ITicker } from '../model';
import {
	getNumberText,
	getPercentData,
	getTickerDescription,
	getTickerName,
	isForexSymbolCell,
} from '@/modules/cell';


interface ICellComponentProps {
	ticker: ITicker;
	meta: IMeta;
}

const props = defineProps<ICellComponentProps>();

const { isShowChart, isShowPercentageChange, isShowLogo, isShowTicker } =
	storeToRefs(usePriceStore());

const label = computed(() =>
	isShowTicker.value ? getTickerDescription(props.ticker.symbol) : getTickerName(props.ticker.symbol),
);

const priceChange = computed(() => getPercentData(props.ticker.changePrice24hPercent));
</script>

<template>
	<div :class="classes.root">
		<ui-icon
			:id="IconIds.Drag"
			width="4px"
			height="12px"
			:class="[classes.icon]"
		/>
		<div :class="classes.content">
			<ui-transition-fade>
				<div v-if="isShowLogo && meta.size.w > 1" :class="classes.logo">
					<ticker-icon
						v-if="!isForexSymbolCell(props.ticker.symbol)"
						:src="props.ticker.symbol.srcImg"
						:ticker="props.ticker.symbol.ticker"
					/>

					<forex-ticker-icon
						v-else-if="isForexSymbolCell(props.ticker.symbol)"
						:src="[props.ticker.symbol.leftSrcImg, props.ticker.symbol.rightSrcImg]"
						:ticker="`${props.ticker.symbol.leftTicker}/${props.ticker.symbol.rightTicker}`"
						:domain="props.ticker.symbol.rightTicker"
					/>
				</div>
			</ui-transition-fade>

			<div :class="classes.container">
				<div :class="classes.desc">
					<div :class="classes.ticker">
						<span>{{ label }}</span>
					</div>
					<div :class="classes.containerSecond">
						<div :class="classes.price">{{ getNumberText(props.ticker.priceCurrent) }}</div>
						<ui-transition-fade>
							<div
								v-if="isShowPercentageChange"
								:class="classes.change"
								:style="{
									color: priceChange.color
								}"
							>
								{{ priceChange.value }}
							</div>
						</ui-transition-fade>
					</div>
				</div>
				<ui-transition-fade>
					<div
						v-if="isShowChart && meta.size.w > 1"
						:class="classes.chart"
					>
						<img
							:src="MockChart"
							style="  width: 90px; height: 40px; object-fit: contain;"
						/>
					</div>
				</ui-transition-fade>
			</div>
		</div>

		<div :class="classes.hoverActions">
			<ui-icon
				:id="IconIds.Pin"
				:width="20"
				:height="20"
				:class="classes.hoverActionIcon"
			/>
		</div>
	</div>
</template>

<style module="classes">
.root {
	position: relative;
	display: flex;
	align-items: center;
	padding: 4px 8px;
	font-size: 16px;
	letter-spacing: 0.104px;
	cursor: pointer;
	gap: 4px;
}

.root:hover .hoverActions {
	display: flex;
}

.hoverActions {
	position: absolute;
	top: 50%;
	right: 4px;
	display: none;
	justify-content: center;
	align-items: center;
	width: 15%;
	max-width: 56px;
	height: 100%;
	padding: 0 6px 0 12px;
	background: linear-gradient(90deg, rgb(255 255 255 / 0%) 0%, var(--bg-color-surface-01) 40%);
	transform: translateY(-50%);
	cursor: default;
}

.hoverActionIcon {
	color: var(--icon-color-base-300);
}

.root:hover .icon {
	color: var(--icon-color-base-300);
}

.root:hover .content {
	background-color: var(--bg-color-surface-02);
}

.desc {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.icon {
	flex: 4px 0 0;
	color: transparent;
	cursor: grab;
}

.icon:active {
	cursor: grabbing;
}

.content {
	display: flex;
	flex-grow: 1;
	align-items: center;
	padding: 4px;
	border-radius: 16px;
}

.logo {
	margin-right: 12px;
}

.container {
	display: flex;
	flex-grow: 1;
	justify-content: space-between;
	gap: 4px;
	align-items: center;
}

.ticker {
	display: inline-flex;
	font-weight: 300;
	line-height: 150%;
	color: var(--text-color-base-100);
	gap: 2px;
}

.containerSecond {
	display: flex;
	gap: 4px;
	line-height: 125%;
}

.price {
	font-weight: 440;
	color: var(--text-color-base-500);
}

.change {
	font-weight: 440;
}
</style>
