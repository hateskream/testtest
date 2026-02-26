<script setup lang="ts">
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiTransitionFade } from '@/shared/ui/transition';
import { UniversalTickerIcon } from '@/shared/ui/ticker';
import type { IMeta } from '@/modules/dashboard-group';
import type { IDisplaySettings, ITicker } from '../../model';
import {
	getNumberText,
	getPercentData,
	getTickerDescription,
	getTickerName,
	isForexSymbolCell,
	isPlaneTextSymbolCell,
} from '@/modules/cell';
import { UiText } from '@/shared/ui/text';
import { UiClamped } from '@/shared/ui/clamped';

interface ICellComponentProps {
	ticker: ITicker;
	settings: IDisplaySettings;
	meta: IMeta;
	hasPin: boolean;
	displayVariant: 'new' | 'default';
}

const props = defineProps<ICellComponentProps>();

const emit = defineEmits<{
	(e: 'togglePin', tickerId: string): void;
	(e: 'ticker-select', tickerId: string): void;
}>();

const label = computed(() =>
	props.settings.isShowTicker ? getTickerName(props.ticker.symbol) : getTickerDescription(props.ticker.symbol),
);

const priceChange = computed(() => getPercentData(props.ticker.changePrice24hPercent));

const tickerIcon = computed(() => {
	const { symbol } = props.ticker;

	if (isForexSymbolCell(symbol)) {
		return {
			symbolType: symbol.symbolType,
			src: symbol.leftSrcImg,
			rightSrc: symbol.rightSrcImg,
			size: 28,
			ticker: `${symbol.leftTicker}/${symbol.rightTicker}`,
		};
	}

	if (!isPlaneTextSymbolCell(symbol)) {
		return {
			symbolType: symbol.symbolType,
			src: symbol.srcImg,
			size: 28,
			ticker: symbol.ticker,
		};
	}

	return null;
});

const preparedPrice = computed(() => getNumberText(props.ticker.priceCurrent));
</script>

<template>
	<div
		:class="classes.root"
		data-icon-glow-trigger
		@click="emit('ticker-select', props.ticker.tickerId)"
	>
		<div :class="classes.content">
			<ui-transition-fade>
				<div v-if="props.settings.isShowLogo && meta.size.w > 1">
					<universal-ticker-icon
						v-if="tickerIcon"
						v-bind="tickerIcon"
					/>
				</div>
			</ui-transition-fade>

			<div :class="classes.container">
				<div :class="classes.desc">
					<ui-clamped :class="classes.ticker" :rows="2">
						<ui-text token="text-300-r">{{ label }}</ui-text>
					</ui-clamped>
					<ui-text :class="classes.containerSecond" token="text-300-r">
						<div :class="classes.price">{{ preparedPrice }}</div>
						<ui-transition-fade>
							<div
								v-if="props.settings.isShowPercentageChange"
								:style="{
									color: priceChange.color
								}"
							>
								{{ priceChange.value }}
							</div>
						</ui-transition-fade>
					</ui-text>
				</div>
				<ui-transition-fade>
					<div
						v-if="props.settings.isShowChart && meta.size.w > 1"
						:class="classes.chart"
					>
						<img
							v-if="props.ticker.price24hChart.src?.length"
							:src="props.ticker.price24hChart.src"
							style="width: 90px; height: 36px; object-fit: cover;"
							alt="chart"
							fetchpriority="high"
							:class="classes.chartImage"
						/>
					</div>
				</ui-transition-fade>
			</div>
		</div>

		<div
			v-if="props.hasPin"
			:class="classes.hoverActions"
			:style="{ display: props.ticker.isPined ? 'flex' : undefined }"
			@click.stop="emit('togglePin', props.ticker.tickerId)"
		>
			<ui-icon
				v-if="props.ticker.isPined"
				:id="IconIds.Pined"
				:width="20"
				:height="20"
				:class="classes.hoverActionIcon"
			/>
			<ui-icon
				v-else
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
	top: 4px;
	right: 8px;
	display: none;
	justify-content: center;
	align-items: center;
	width: 15%;
	max-width: 56px;
	height: calc(100% - 8px);
	padding: 0 6px 0 12px;
	background: linear-gradient(90deg, rgb(255 255 255 / 0%) 0%, var(--bg-color-surface-02) 30%);
	border-radius: 0 16px 16px 0;
}

.hoverActionIcon {
	color: var(--icon-color-base-300);
	transform: rotateZ(45deg);
}

.pined {
	display: flex;
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
	gap: 1px;
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
	height: 60px;
	padding: 6px 10px;
	border-radius: 16px;
	transition: background-color 0.3s ease;
	gap: 12px;
}

.container {
	display: flex;
	flex-grow: 1;
	justify-content: space-between;
	gap: 4px;
	align-items: center;
}

.ticker {
	color: var(--text-300, rgb(255 255 255 / 62%));
}

.containerSecond {
	display: flex;
	overflow-x: auto;
	scrollbar-width: none;
	-ms-overflow-style: none;
	gap: 4px;
}

.price {
	flex-shrink: 0;
	font-weight: 440;
	color: var(--text-color-base-500);
}

.enterActive,
.leaveActive {
	transition: opacity 0.3s ease;
}

.enterFrom,
.leaveTo {
	opacity: 0;
}

.chartImage {
	mask-image: linear-gradient(to right, transparent, #000000 30%);
}
</style>
