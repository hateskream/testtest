<script setup lang="ts">
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiTransitionFade } from '@/shared/ui/transition';
import { forexTickerIcon, tickerIcon } from '@/shared/ui/ticker';
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

import ForexTickerIconDashboard from '@/shared/ui/ticker/dashboard/forex-ticker-icon-dashboard.vue';


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
}>();

const label = computed(() =>
	props.settings.isShowTicker ? getTickerName(props.ticker.symbol) : getTickerDescription(props.ticker.symbol),
);

const priceChange = computed(() => getPercentData(props.ticker.changePrice24hPercent));
</script>

<template>
	<div :class="classes.root">
		<div :class="classes.content">
			<ui-transition-fade>
				<div v-if="props.settings.isShowLogo && meta.size.w > 1" :class="classes.logo">
					<ticker-icon
						v-if="!isForexSymbolCell(props.ticker.symbol) && !isPlaneTextSymbolCell(props.ticker.symbol)"
						:src="props.ticker.symbol.srcImg"
						:ticker="props.ticker.symbol.ticker"
						:size="20"
					/>

					<template v-else-if="isForexSymbolCell(props.ticker.symbol)">
						<forex-ticker-icon-dashboard
							v-if="props.displayVariant === 'new'"
							:src-image="[props.ticker.symbol.leftSrcImg, props.ticker.symbol.rightSrcImg]"
							:display-variant="props.displayVariant"
							:ticker="`${props.ticker.symbol.leftTicker}/${props.ticker.symbol.rightTicker}`"
							:size="20"
							:padding="0"
						/>

						<forex-ticker-icon
							v-else
							:src="[props.ticker.symbol.leftSrcImg, props.ticker.symbol.rightSrcImg]"
							:ticker="`${props.ticker.symbol.leftTicker}/${props.ticker.symbol.rightTicker}`"
							:domain="props.ticker.symbol.rightTicker"
						/>
					</template>
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
								v-if="props.settings.isShowPercentageChange"
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
			:style="
				props.ticker.isPined
					? {
						display: 'flex',
					}
					: {}
			"
			@click="emit('togglePin', props.ticker.tickerId)"
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
	padding: 6px 10px;
	border-radius: 16px;
	transition: background-color 0.3s ease;
}

.logo {
	margin-right: 6px;
}

.container {
	display: flex;
	flex-grow: 1;
	justify-content: space-between;
	gap: 4px;
	align-items: center;
}

.ticker {
	display: -webkit-box;
	overflow: hidden;
	font-style: normal;
	font-weight: 400;
	font-size: var(--font-text-300-r-size, 12.5px);
	line-height: 180%;
	color: var(--text-300, rgb(255 255 255 / 62%));
	letter-spacing: 0.075px;
	text-overflow: ellipsis;
	gap: 2px;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	line-clamp: 2;
}

.containerSecond {
	display: flex;
	overflow-x: auto;
	font-weight: 400;
	font-size: var(--font-text-300-r-size, 13.3px);
	line-height: 180%;
	letter-spacing: 0.146px;
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
