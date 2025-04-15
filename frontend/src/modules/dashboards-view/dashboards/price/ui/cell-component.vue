<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, useCssModule } from 'vue';

import type { ICurrency } from '../model';
import { usePriceStore } from '../stores';
import { UiImage } from '@/shared/ui/image';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import MockChart from '@/assets/images/mock/chart.svg';

interface ICellComponentProps {
	currency: ICurrency;
}

const props = defineProps<ICellComponentProps>();

const { isShowChart, isShowPercentageChange, isShowLogo, isShowTicker } =
	storeToRefs(usePriceStore());

const classes = useCssModule('classes');

const transitionClasses = {
	'enter-active-class': classes['fade-enter-active'],
	'leave-active-class': classes['fade-leave-active'],
	'enter-from-class': classes['fade-enter-from'],
	'leave-to-class': classes['fade-leave-to'],
};

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
			<transition v-bind="transitionClasses">
				<div
					v-if="isShowLogo"
					:class="classes.logo"
				>
					<ui-image
						:src="props.currency.srcImage"
						replacement="/images/market/ADA.png"
					/>
				</div>
			</transition>

			<div :class="classes.container">
				<div :class="classes.ticker">
					{{ label }}
				</div>
				<div :class="classes.containerSecond">
					<div :class="classes.marketCap">{{ props.currency.marketCap }}</div>
					<transition v-bind="transitionClasses">
						<div
							v-if="isShowPercentageChange"
							:class="classes.change"
						>
							{{ props.currency.changeLastDay }}
						</div>
					</transition>
				</div>
			</div>
			<transition v-bind="transitionClasses">
				<div
					v-if="isShowChart"
					:class="classes.chart"
				>
					<img :src="MockChart" />
				</div>
			</transition>
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
	display: flex;
	justify-content: center;
	align-items: center;
	width: 32px;
	height: 32px;
	margin-right: 12px;
	border: 1px solid var(--border-color-base-300);
	border-radius: 50%;
}

.container {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	gap: 4px;
}

.ticker {
	font-weight: 300;
	line-height: 150%;
	color: var(--text-color-base-100);
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

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
