<script setup lang="ts">
import { computed, defineAsyncComponent, ref, useTemplateRef } from 'vue';
import { useWindowSize } from '@vueuse/core';

import { getChartSectionsByType, TickerType, type ViewMode } from '../models';
import { RangeChart } from '@/shared/ui/chart-range';
import { UiSkeleton } from '@/shared/ui/skeleton';
import { useDelayedLoading } from '@/shared/composables';
import { createTickerContext } from '../composables';

import TickerSection from './section-layout.vue';
import TickerLayout from './ticker-layout.vue';
import TickerColumnsLayout from './columns-layout.vue';


const ChartComponent = defineAsyncComponent(() => import('@/modules/lightweight-charts/ui/chart-component.vue'));


export interface ITickerComponentProps {
	type: TickerType;
	id: string;
}

const props = defineProps<ITickerComponentProps>();

const chartWidgetSections = computed(() => {
	return getChartSectionsByType(props.type);
});

const viewMode = ref<ViewMode>('mixed');

createTickerContext({
	tickerType: computed(() => props.type),
	tickerId: computed(() => props.id),
});

const { loading: chartLoading } = useDelayedLoading({ immediate: true, delay: 1000 });

const chartLayoutEl = useTemplateRef('chartLayoutRef');

const { height: windowHeight } = useWindowSize();

const chartHeight = computed(() => {
	const availableHeight = windowHeight.value;
	const height = Math.floor(availableHeight * 0.5);
	return `${height}px`;
});

function setChart() {
	chartLayoutEl.value?.setMixedViewMode();
}

function setReports() {
	chartLayoutEl.value?.setReportsViewMode();
}

const disableScroll = ref(false);

function startDisableScroll() {
	disableScroll.value = true;
}

function endDisableScroll() {
	disableScroll.value = false;
}


const leftSections = computed(() => chartWidgetSections.value.left);
const centerSections = computed(() => chartWidgetSections.value.center);
const rightSections = computed(() => chartWidgetSections.value.right);

const currentChartRanges = [
	RangeChart['1D'],
	RangeChart['1W'],
	RangeChart['1M'],
	RangeChart['3M'],
	RangeChart['6M'],
	RangeChart['YTD'],
	RangeChart['1Y'],
	RangeChart['ALL'],
];
</script>

<template>
	<ticker-layout
		ref="chartLayoutRef"
		@change-view="viewMode = $event"
		@animation-start="startDisableScroll"
		@animation-end="endDisableScroll"
	>
		<template #topContent>
			<div
				ref="chartContainerRef"
				:class="classes.placeholderTop"
				:style="{height:chartHeight}"
			>
				<suspense>
					<template #default>
						<chart-component
							v-show="!chartLoading"
							ref="chartRef"
							width="100%"
							:height="chartHeight"
							:disable-scroll="disableScroll"
							:range-list="currentChartRanges"
						/>
					</template>
					<template #fallback>
						<ui-skeleton
							border-radius="12px"
							width="100%"
							:height="chartHeight"
						/>
					</template>
				</suspense>

				<ui-skeleton
					v-if="chartLoading"
					:class="classes.skeletonOverlay"
					border-radius="12px"
					width="100%"
					height="100%"
				/>
			</div>
		</template>

		<template #botContent>
			<ticker-columns-layout :disable-scroll="disableScroll">
				<template #leftCol>
					<template
						v-for="section in leftSections"
						:key="section.title"
					>
						<template v-if="section.component">
							<ticker-section
								:title="section.title"
								:section-type="section.component"
								:height="section.height"
								:section="section"
							/>
						</template>
					</template>
				</template>

				<template #mainCol>
					<template
						v-for="section in centerSections"
						:key="section.title"
					>
						<ticker-section
							v-if="section.component"
							:title="section.title"
							:section-type="section.component"
							:height="section.height"
							:section="section"
						/>
					</template>
				</template>

				<template #rightCol>
					<template
						v-for="section in rightSections"
						:key="section.title"
					>
						<ticker-section
							v-if="section.component"
							:title="section.title"
							:section-type="section.component"
							:height="section.height"
							:section="section"
						/>
					</template>
				</template>
			</ticker-columns-layout>
		</template>
	</ticker-layout>

	<div :class="classes.navigation">
		<button
			:class="[classes.navigationBtn, { [classes.active]: viewMode === 'mixed' }]"
			@click="setChart"
		>
			Mixed
		</button>
		<button
			:class="[classes.navigationBtn, { [classes.active]: viewMode === 'reports' }]"
			@click="setReports"
		>
			Reports
		</button>
	</div>
</template>

<style module="classes">
.placeholderTop {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	min-height: calc(50vh - 40px);
}

.skeletonOverlay {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 10;
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
</style>
