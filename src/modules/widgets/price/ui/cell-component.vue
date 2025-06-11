<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import type { ICurrency } from '../model';
import { usePriceStore } from '../stores';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import MockChart from '@/assets/images/mock/chart.svg';
import { UiTransitionFade } from '@/shared/ui/transition';
import { forexTickerIcon, tickerIcon } from '@/shared/ui/ticker';


interface ICellComponentProps {
	currency: ICurrency;
}

const props = defineProps<ICellComponentProps>();

const { isShowChart, isShowPercentageChange, isShowLogo, isShowTicker } =
	storeToRefs(usePriceStore());

const label = computed(() => (isShowTicker.value ? props.currency.ticker : props.currency.name));
</script>

<template>
	<div :class="classes.root">
		<ui-icon
			:id="IconIds.Drag"
			width="4px"
			height="12px"
			:class="[classes.icon, 'price-drag']"
		/>
		<div :class="[classes.content, 'price-no-drag']">
			<ui-transition-fade>
				<div v-if="isShowLogo" :class="classes.logo">
					<ticker-icon
						v-if="props.currency.market !== 'forex' && !Array.isArray(props.currency.srcImage)"
						:src="props.currency.srcImage"
						:ticker="props.currency.ticker"
					/>

					<forex-ticker-icon
						v-else-if="Array.isArray(props.currency.srcImage) && props.currency.domain"
						:src="props.currency.srcImage"
						:ticker="props.currency.ticker"
						:domain="props.currency.domain"
					/>
				</div>
			</ui-transition-fade>

			<div :class="classes.container">
				<div :class="classes.ticker">
					<span>{{ label }}</span>
					<span v-if="props.currency.market === 'forex'">{{ props.currency.domain }}</span>
				</div>
				<div :class="classes.containerSecond">
					<div :class="classes.marketCap">{{ props.currency.marketCap }}</div>
					<ui-transition-fade>
						<div
							v-if="isShowPercentageChange"
							:class="classes.change"
						>
							{{ props.currency.changeLastDay }}
						</div>
					</ui-transition-fade>
				</div>
			</div>
			<ui-transition-fade>
				<div
					v-if="isShowChart"
					:class="classes.chart"
				>
					<img :src="MockChart" />
				</div>
			</ui-transition-fade>
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	align-items: center;
	padding: 4px 8px;
	font-size: 16px;
	letter-spacing: 0.104px;
	cursor: pointer;
	gap: 4px;
}

.root:hover .icon {
	color: var(--icon-color-base-300);
}

.root:hover .content {
	background-color: var(--bg-color-surface-02);
}

.icon {
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
	flex-direction: column;
	gap: 4px;
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

.marketCap {
	font-weight: 440;
	color: var(--text-color-base-500);
}

.change {
	font-weight: 440;
	color: rgb(178 242 211 / 100%);
}

.chart {
	margin-left: 42px;
}
</style>
