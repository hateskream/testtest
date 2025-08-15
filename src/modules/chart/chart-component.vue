<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { useElementSize, useWindowSize } from '@vueuse/core';


import { useChartStore } from '@/modules/chart/store';
import { Chart } from '@/modules/lightweight-charts';
import { ChartHeaderComponent } from './components/header';
import { ChartColumnsLayout, ChartLayout } from './ui';
import {
	CHART_COMPONENT_MAP,
	type CHART_SECTION_COMPONENT, TickerType, getChartSectionsByType,
} from './models';
import { RangeChart } from '@/shared/ui/chart-range';
import { ChartWidgetExplorer } from '@/modules/chart/components/widgets';

const { randomizeExchanges, setMode } = useChartStore();


export interface IChartComponentProps {
	type: TickerType;
	id: number;
}

const props = defineProps<IChartComponentProps>();

const chartWidgetSections = computed(() => {
	return getChartSectionsByType(props.type);
});

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
	return `${height}px`;
});


const getComponent = (componentType?: CHART_SECTION_COMPONENT) => {
	return componentType ? CHART_COMPONENT_MAP[componentType] : null;
};


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

const explorerData = computed(() => {
	return [...chartWidgetSections.value.center, ...chartWidgetSections.value.right];
});

const leftSections = computed(() => chartWidgetSections.value.left);
const centerSections = computed(() => chartWidgetSections.value.center);
const rightSections = computed(() => chartWidgetSections.value.right);

watch(() => props.type, (newType) => {
	if (newType === TickerType.STOCK) {
		setMode(TickerType.STOCK);
	} else {
		setMode(TickerType.CRYPTO);
	}
}, { immediate: true });

</script>

<template>
	<chart-layout
		ref="chartLayoutEl"
		@change-view="viewMode = $event"
		@animation-start="startDisableScroll"
		@animation-end="endDisableScroll"
	>
		<template #header>
			<chart-header-component :type="props.type" />
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
					:range-list="Object.values(RangeChart)"
				/>
			</div>
		</template>

		<template #botContent>
			<chart-columns-layout :disable-scroll="disableScroll">
				<!-- Left Column -->
				<template #leftCol>
					<template
						v-for="section in leftSections"
						:key="section.id"
					>
						<template v-if="section.component">
							<component
								:is="getComponent(section.component)"
								:section="section"
								:register-item-ref="registerItemRef"
								:active-section="activeSection"
								:selected-item="selectedItem"
							/>
						</template>
						<chart-widget-explorer
							v-else-if="section.id === 'explorer'"
							:sections="explorerData"
							@item-selected="handleSelected"
						/>
					</template>
				</template>

				<!-- Main/Center Column -->
				<template #mainCol>
					<template
						v-for="section in centerSections"
						:key="section.id"
					>
						<component
							:is="getComponent(section.component)"
							v-if="section.component"
							:section="section"
							:register-item-ref="registerItemRef"
							:active-section="activeSection"
							:selected-item="selectedItem"
						/>
					</template>
				</template>

				<!-- Right Column -->
				<template #rightCol>
					<template
						v-for="section in rightSections"
						:key="section.id"
					>
						<component
							:is="getComponent(section.component)"
							v-if="section.component"
							:section="section"
							:register-item-ref="registerItemRef"
							:active-section="activeSection"
							:selected-item="selectedItem"
						/>
					</template>
				</template>
			</chart-columns-layout>
		</template>
	</chart-layout>

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
		<button
			:class="classes.navigationBtn"
			@click="handleRandomize"
		>
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
	margin-bottom: 30px;
}
</style>
