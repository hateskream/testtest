<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { useWindowSize } from '@vueuse/core';

import { ChartPriceTickerWidget } from '@/modules/widgets/chart-price';
import { isFeatureEnabled } from '@/shared/lib';
import { createTickerContext, useGoToTickerPage } from '../composables';
import { createTickerIdFromType, getChartSectionsByTicker, TickerType, type ViewMode } from '../models';
import { ColumnsLayout, TickerLayout } from './layout';
import { TickerSection } from './sections';

export interface ITickerComponentProps {
	type: TickerType;
	id: string;
}

const props = defineProps<ITickerComponentProps>();

const { height: windowHeight } = useWindowSize();

const chartHeight = computed(() => {
	const availableHeight = windowHeight.value;
	const height = Math.floor(availableHeight * 0.5);
	return `${height}px`;
});

const viewMode = ref<ViewMode>('mixed');

const canonicalTickerId = computed(() => createTickerIdFromType(props.type, props.id));

const chartWidgetSections = computed(() => {
	return getChartSectionsByTicker({
		tickerType: props.type,
		tickerId: canonicalTickerId.value,
	});
});

const { goToTickerPage } = useGoToTickerPage();

function changeTickerId(tickerId: string) {
	goToTickerPage(tickerId);
}

createTickerContext({
	tickerId: canonicalTickerId,
	changeTickerId,
});

const chartLayoutEl = useTemplateRef('chartLayoutRef');

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

const isChartFullView = ref(false);

const navigationIsEnabled = isFeatureEnabled('TICKER_NAVIGATION_MENU_ENABLED');
</script>

<template>
	<ticker-layout
		ref="chartLayoutRef"
		:show-header="!isChartFullView"
		@change-view="viewMode = $event"
		@animation-start="startDisableScroll"
		@animation-end="endDisableScroll"
	>
		<template #topContent>
			<div :style="{ height: chartHeight }">
				<chart-price-ticker-widget
					v-model:full-view="isChartFullView"
					:meta="{ tickerId: canonicalTickerId }"
					handle-scale
					handle-scroll
					@change-ticker="changeTickerId"
				/>
			</div>
		</template>

		<template #botContent>
			<columns-layout v-show="!isChartFullView" :disable-scroll="disableScroll">
				<template #leftCol>
					<template
						v-for="section in leftSections"
						:key="section.id"
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

				<template v-if="centerSections.length" #mainCol>
					<template
						v-for="section in centerSections"
						:key="section.id"
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
						:key="section.id"
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
			</columns-layout>
		</template>
	</ticker-layout>
	<div
		v-if="navigationIsEnabled"
		v-show="!isChartFullView"
		:class="classes.navigation"
	>
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
