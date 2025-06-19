<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { useElementSize, useWindowSize } from '@vueuse/core';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { useChartStore } from '@/modules/chart/store';
import { Chart } from '@/modules/lightweight-charts';
import {
	ChartHeaderComponent,
	ChartWidgetPricePerformance,
	ChartWidgetsExplorer,
	chartWidgetTestSections,
	ChartMainColumnComponent,
} from './components';
import { ChartColumnsLayout, ChartLayout } from './ui';
import { chartWidgetRealSections } from '@/modules/chart/components/widgets/explorer/models';
import {
	ChartSectionYearlyRevenue,
	ChartSectionPriceTarget,
	ChartSectionValuationsAndEstimates,
} from './components/sections';
import { ChartSectionInsightAndActivity } from '@/modules/chart/components/sections';

import ChartSectionQuarterlyRevenue
	from '@/modules/chart/components/sections/quarterly-revenue/chart-section-quarterly-revenue.vue';
import ChartSectionStockPeersBulk
	from '@/modules/chart/components/sections/stock-peers-bulk/chart-section-stock-peers-bulk.vue';

const { randomizeExchanges } = useChartStore();

const viewMode = ref('mixed');

const activeSection = ref<string | null>(null);
const selectedItem = ref<string | null>(null);

const chartLayoutEl = ref<InstanceType<typeof ChartLayout> | null>(null);
const chartContainerEl = ref<HTMLDivElement | null>(null);
const chartRef = ref<InstanceType<typeof Chart> | null>(null);

const itemRefs = ref<Map<string, HTMLElement>>(new Map());

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

function handleSelected(section: string | null, item: string | null) {
	activeSection.value = section;
	selectedItem.value = item;
}

// Function to register item refs from child components
const registerItemRef = (itemId: string, element: HTMLElement | null) => {
	if (element) {
		itemRefs.value.set(itemId, element);
	} else {
		itemRefs.value.delete(itemId);
	}
};


watch(selectedItem, async (newItemId) => {
	if (newItemId) {
		await nextTick();
		const itemElement = itemRefs.value.get(newItemId);
		if (itemElement) {
			itemElement.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		}
	}
});
// TODO recheck if highlights will be needed or back side  relations , dont delete
// watch(activeSection, async (newItemId) => {
// 	if (newItemId && !selectedItem.value) {
// 		await nextTick();
// 		const itemElement = itemRefs.value.get(newItemId);
// 		if (itemElement) {
// 			itemElement.scrollIntoView({
// 				behavior: 'smooth',
// 				block: 'start',
// 			});
// 		}
// 	}
// });


const explorerDate = computed(() => {
	return [...chartWidgetRealSections, ...chartWidgetTestSections];
});

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
					<chart-widgets-explorer
						:sections="explorerDate"
						@item-selected="handleSelected"
					/>
				</template>
				<template #mainCol>
					<chart-section-valuations-and-estimates
						:register-item-ref="registerItemRef"
						:section="chartWidgetRealSections[0]"
					/>
					<chart-section-price-target
						:section="chartWidgetRealSections[1]"
						:register-item-ref="registerItemRef"
						:active-section="activeSection"
						:selected-item="selectedItem"
					/>
					<chart-section-yearly-revenue
						:section="chartWidgetRealSections[2]"
						:register-item-ref="registerItemRef"
					/>
					<chart-section-stock-peers-bulk
						:section="chartWidgetRealSections[3]"
						:register-item-ref="registerItemRef"
					/>
					<chart-section-quarterly-revenue
						:section="chartWidgetRealSections[4]"
						:register-item-ref="registerItemRef"
					/>
					<chart-main-column-component
						:sections="chartWidgetTestSections"
						:active-section="activeSection"
						:selected-item="selectedItem"
						:register-item-ref="registerItemRef"
					/>


				</template>
				<template #rightCol>
					<chart-section-insight-and-activity />
					<div :class="classes.hotfix"/>
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

.section {
	display: flex;
	gap: 3px;
}

.columnTitle {
	position: sticky;
	top: 0;
	z-index: 10;
	display: flex;
	align-items: center;
	margin-bottom: 22px;
	padding: 12px 16px 12px 0;
	font-size: var(--typography-headers-size-h02);
	background: var(--bg-color-surface-00);
	gap: 8px;
}
.hotfix {
	margin-bottom:30px;
}
</style>
