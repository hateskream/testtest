<script setup lang="ts">
import { ref, computed } from 'vue';
import { useElementSize, useWindowSize } from '@vueuse/core';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { useChartStore } from '@/modules/chart/store';
import { Chart } from '@/modules/lightweight-charts';
import { ChartHeaderComponent, ChartWidgetPricePerformance } from './components';
import { ChartColumnsLayout, ChartLayout } from './ui';


const { randomizeExchanges } = useChartStore();

const viewMode = ref('mixed');

const chartLayoutEl = ref<InstanceType<typeof ChartLayout> | null>(null);
const chartContainerEl = ref<HTMLDivElement | null>(null);
const chartRef = ref<InstanceType<typeof Chart> | null>(null);

const { width: containerWidth } = useElementSize(chartContainerEl);
const { height: windowHeight } = useWindowSize();

const chartWidth = computed(() => {
	return containerWidth.value || 500;
});

const chartHeight = computed(() => {
	const height = Math.floor(windowHeight.value * 0.5);

	return height;
});

const setChart = () => {
	chartLayoutEl.value?.setMixedViewMode();
};

const setReports = () => {
	chartLayoutEl.value?.setReportsViewMode();
};

const handleRandomize = () => {
	randomizeExchanges();
	chartRef.value?.regenerateData();
};

const disableScroll = ref(false);

const startDisableScroll = () => {
	disableScroll.value = true;

};
const endDisableScroll = () => {
	disableScroll.value = false;
};

</script>

<template>

	<chart-layout
		ref="chartLayoutEl"
		@change-view="viewMode=$event"
		@animation-start="startDisableScroll"
		@animation-end="endDisableScroll"
	>
		<template #header>
			<chart-header-component />
		</template>
		<template #topContent>
			<div
				ref="chartContainerEl"
				:class="classes.placeholderTop"
			>
				<chart
					ref="chartRef"
					:width="chartWidth"
					:height="chartHeight"
					:disable-scroll="disableScroll"
				/>
			</div>
		</template>
		<template #botContent>
			<chart-columns-layout :disable-scroll="disableScroll">
				<template #leftCol>
					<div :class="classes.columnTitle">
						<ui-icon
							:id="IconIds.Deals"
							:class="classes.titleIcon"
							width="20px"
							height="20px"
						/>
						<span>Overview</span>
					</div>
					<chart-widget-price-performance />
					<div :class="classes.columnContent">
						<div :class="classes.space"></div>
						<div :class="classes.placeholderBlock"></div>
						<div :class="classes.placeholderBlock"></div>
						<div :class="classes.placeholderBlock"></div>
						<div :class="classes.placeholderBlock"></div>
					</div>
				</template>
				<template #mainCol>
					<div :class="classes.columnTitle">
						<ui-icon
							:id="IconIds.Deals"
							:class="classes.titleIcon"
							width="20px"
							height="20px"
						/>
						<span>Financials</span>
					</div>
					<div :class="classes.columnContent">
						<div :class="classes.placeholderBlock"></div>
						<div :class="classes.placeholderBlock"></div>
						<div :class="classes.placeholderBlock"></div>
						<div :class="classes.placeholderBlock"></div>
						<div :class="classes.placeholderBlock"></div>
						<div :class="classes.placeholderBlock"></div>
						<div :class="classes.placeholderBlock"></div>
						<div :class="classes.placeholderBlock"></div>
						<div :class="classes.placeholderBlock"></div>
						<div :class="classes.placeholderBlock"></div>
						<div :class="classes.placeholderBlock"></div>
					</div>
				</template>
				<template #rightCol>
					<div :class="classes.columnTitle">
						<ui-icon
							:id="IconIds.Deals"
							:class="classes.titleIcon"
							width="20px"
							height="20px"
						/>
						<span>Insights & Activity</span>
					</div>
					<div :class="classes.columnContent">
						<div :class="classes.placeholderBlock"></div>
						<div :class="classes.placeholderBlock"></div>
						<div :class="classes.placeholderBlock"></div>
						<div :class="classes.placeholderBlock"></div>
						<div :class="classes.placeholderBlock"></div>
					</div>
				</template>
			</chart-columns-layout>
		</template>
	</chart-layout>
	<div :class="classes.navigation">
		<button :class="[classes.navigationBtn,{[classes.active]:viewMode==='mixed'}]" @click="setChart">
			Mixed
		</button>
		<button :class="[classes.navigationBtn,{[classes.active]:viewMode==='reports'}]" @click="setReports">
			Reports
		</button>
		<button :class="classes.navigationBtn" @click="handleRandomize">
			Randomize
		</button>
	</div>

</template>

<style module="classes">
.placeholderTop {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	min-height: 30svh;
}

.columnTitle {
	display: flex;
	align-items: center;
	margin-bottom: 22px;
	font-size: var(--typography-headers-size-h02);
	gap: 8px;
}

.titleIcon {
	color: #ffffff;
}

.columnContent {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.placeholderBlock {
	min-height: 300px;
	background: rgb(84 84 95 / 60%);
}

.navigation {
	position: fixed;
	bottom: 15px;
	left: 50%;
	z-index: 3;
	display: flex;
	padding: 4px;
	background: rgb(84 84 95 / 60%);
	border: 1px solid rgb(199 199 199 / 10%);
	border-radius: 99px;
	box-shadow: 0 6px 12px 0 rgb(0 0 0 / 35%);
	transform: translateX(-50%);
	backdrop-filter: blur(24px);
}

.navigationBtn {
	height: 34px;
	padding: 0 12px;
	color: var(--text-color-base-300);
	border-radius: 100px;
	cursor: pointer;
}

.active {
	color: var(--text-color-contrast-500);
	background: #ffffff;
}

.space {
	height: 30px;
}
</style>
