<script setup lang="ts">
import { ref, computed } from 'vue';
import { useElementSize, useWindowSize } from '@vueuse/core';

import { LayoutComponent } from '@/modules/layout';
import { ChartHeader, ChartLayout, ColumnsLayout } from '@/modules/chart';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { useChartStore } from '@/modules/chart/store';
import { Chart } from '@/modules/lightweight-charts';

import PricePerformanceWidget from '@/modules/chart/components/widgets/range/price-performance-widget.vue';

const { randomizeExchanges } = useChartStore();

const viewMode = ref('mixed');

const chartLayoutEl = ref<InstanceType<typeof ChartLayout> | null>(null);
const chartContainerEl = ref<HTMLDivElement | null>(null);
const chartRef = ref<InstanceType<typeof Chart> | null>(null);

const { width: containerWidth, height: containerHeight } = useElementSize(chartContainerEl);
const { height: windowHeight } = useWindowSize();

const chartWidth = computed(() => {
	return containerWidth.value || 500;
});

const chartHeight = computed(() => {
	const minHeight = Math.floor(windowHeight.value * 0.3);
	const calculatedHeight = Math.max(
		containerHeight.value || 0,
		minHeight,
		515,
	);
	return calculatedHeight;
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
</script>

<template>
	<layout-component :is-curtain-fixed="false">
		<template #content>
			<chart-layout ref="chartLayoutEl" @change-view="viewMode=$event">
				<template #header>
					<chart-header />
				</template>
				<template #topContent>
					<div
						ref="chartContainerEl"
						:class="classes.placeholderTop"
					>
						<chart
							ref="chartRef"
							:width="chartWidth"
							:height="500"
						/>
					</div>
				</template>
				<template #botContent>
					<columns-layout>
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
							<price-performance-widget />
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
					</columns-layout>
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
	</layout-component>
</template>

<style module="classes">
.placeholderTop {
	min-height: 30svh;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
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
</style>
