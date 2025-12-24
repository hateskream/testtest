<script setup lang="ts">
import { computed, defineAsyncComponent, ref, shallowRef, useTemplateRef, watch } from 'vue';

import { getWidgetComponent, type IMeta } from '../../dashboards/model';
import type { DisplayVariant, IWidget } from '../model';
import { MIN_ROW_HEIGHT, MAX_ROW_HEIGHT } from '../../tv';
import {
	calcSizeSideGridCell,
	canChangeHeight,
	changeHeight,
	getHeightContent,
	getMinHeight,
	getWidgetHeight,
	resizeHandlerMapping,
} from '../model';
import { UiSkeleton } from '@/shared/ui/skeleton';
import { useDelayedLoading } from '@/shared/composables';
import { useResizable } from '../composables';
import { isFeatureEnabled } from '@/shared/lib';

import HighlighterComponent from './highlighter-component.vue';

interface IWidgetExposed {
	scrollBy: (px: number) => void;
	snapHeightToNearestStep?(height: number): number;
	calcMaxCountRowVisible?(height: number): number;
}

interface IWidgetComponentProps {
	widget: IWidget;
	columnWidth: number;
	colCount: number;
	parentHeight: number;
	activeDisplayVariant: DisplayVariant;
	allDisplayVariants: DisplayVariant[];
	isVisible: boolean;
}

const props = defineProps<IWidgetComponentProps>();

const emits = defineEmits<{
	'set-widget-state-type': [string, string];
	'change-height': [string, number];
	'change-max-count-row': [string, number];
}>();

const { size } = useResizable(
	useTemplateRef('sizer'),
	useTemplateRef('widget'),
	{
		minHeight: getMinHeight(props.widget),
		maxHeight: props.widget.maxHeight,
		axis: 'vertical',
		cbOnPointerUp: () => snapToNearestStep(size.value),
		isActivated: () => canChangeHeight(props.widget) && isFeatureEnabled('RESIZE_HEIGHT_WIDGETS'),
	},
);

const { loading, triggerLoading } = useDelayedLoading({ immediate: false });

const loaded = ref(false);
const component = shallowRef(null);

const refComponent = ref<IWidgetExposed | null>(null);

const isFiniteWidget = computed(() => Number.isFinite(props.widget.height));

const heightWidget = computed(() =>
	isFiniteWidget.value
		? props.widget.height
		: props.parentHeight,
);

const cellSize = computed(() => calcSizeSideGridCell(heightWidget.value, MIN_ROW_HEIGHT, MAX_ROW_HEIGHT));

const meta = computed((): IMeta => ({
	market: '',
	widgetId: props.widget.id,
	isResizing: false,
	size: {
		h: cellSize.value.count,
		w: props.colCount,
	},
	maxSize: {
		h: cellSize.value.count,
		w: props.colCount,
	},
	name: props.widget.name,
	defaultStateType: props.widget.defaultStateType,
	isLoading: loading.value,
	dashboards: [],
	widgetType: props.widget.widgetType,
	isOpenFull: false,
	columnWidth: props.columnWidth,
	rowHeight: cellSize.value.size,
	maxCountRowTable: props.widget.maxCountRow,
	activeDisplayVariant:  props.activeDisplayVariant,
	allDisplayVariants: props.allDisplayVariants,
}));

watch(
	() => props.isVisible,
	async visible => {
		if (visible && !loaded.value) {
			component.value = await defineAsyncComponent({
				loader: getWidgetComponent('dashboard', props.widget.widgetType),
			});
			loaded.value = true;

			triggerLoading();
		}
	},
	{ immediate: true },
);

watch(
	size,
	newHeight => {
		if (!isFiniteWidget.value) {
			return;
		}

		const { widget: { maxCountRow } } = props;

		emits('change-height', props.widget.id, newHeight);
		if (maxCountRow) {
			emitChangeMaxCountRow(newHeight);
		}
	},
);

watch(
	() => refComponent.value,
	newValue => {
		if (!newValue) {
			return;
		}

		const {
			snapHeightToNearestStep: snapHeightToNearestStepOverrided,
			calcMaxCountRowVisible: calcMaxCountRowVisibleOverrided,
		} = newValue || {};

		if (calcMaxCountRowVisibleOverrided) {
			resizeHandlerMapping[props.widget.widgetType]
				.calcMaxCountRowVisible = (widget, height) => {
					const contentHeight = getHeightContent(changeHeight(widget, height));

					return calcMaxCountRowVisibleOverrided(contentHeight);
				};
		}


		if (snapHeightToNearestStepOverrided) {
			resizeHandlerMapping[props.widget.widgetType]
				.snapHeightToNearestStep = (widget, height: number) => {
					const contentHeight = getHeightContent(changeHeight(widget, height));

					const snappedContentHeight = snapHeightToNearestStepOverrided(contentHeight);

					return getWidgetHeight(
						widget,
						snappedContentHeight,
					);
				};
		}

		if (!isFiniteWidget.value) {
			return;
		}

		snapToNearestStep(size.value);
	},
);

watch(
	() => props.columnWidth,
	() => {
		if (!isFiniteWidget.value) {
			return;
		}

		snapToNearestStep(size.value);
	},
);

function scrollBy(px: number) {
	if (!refComponent.value) {
		return;
	}

	refComponent.value.scrollBy(px);
}

function setWidgetStateType(widgetId: string, stateType: string) {
	emits('set-widget-state-type', widgetId, stateType);
}

function snapToNearestStep(height: number) {
	const snappedHeight = resizeHandlerMapping[props.widget.widgetType].snapHeightToNearestStep(props.widget, height);
	if (!snappedHeight) {
		return;
	}

	emits('change-height', props.widget.id, snappedHeight);
	emitChangeMaxCountRow(snappedHeight);
}

function emitChangeMaxCountRow(newHeight: number) {
	emits(
		'change-max-count-row',
		props.widget.id,
		resizeHandlerMapping[props.widget.widgetType]
			.calcMaxCountRowVisible(props.widget, newHeight),
	);
}

const flashRef = useTemplateRef('flash');

function triggerFlash() {
	flashRef.value?.trigger();
}

defineExpose({ triggerFlash, scrollBy });
</script>

<template>
	<div :class="classes.container">
		<highlighter-component ref="flash" />

		<div
			ref="widget"
			:class="classes.widget"
			:style="{
				height: heightWidget + 'px',
			}"
		>
			<suspense v-if="loaded">
				<template #default>
					<component
						:is="component"
						ref="refComponent"
						:meta="meta"
						@set-widget-state-type="setWidgetStateType"
					/>
				</template>
				<template #fallback>
					<ui-skeleton
						border-radius="12px"
						width="100%"
						height="100%"
					/>
				</template>
			</suspense>

			<ui-skeleton
				v-else
				border-radius="12px"
				width="100%"
				height="100%"
			/>
		</div>
		<div
			v-if="isFiniteWidget"
			:class="classes.sizerContainer"
		>
			<div
				ref="sizer"
				:class="classes.sizer"
			/>
		</div>

	</div>
</template>

<style module="classes">
.container {
	position: relative;
	display: flex;
	flex-direction: column;
	height: 100%;
}

.widget {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
}

.sizerContainer {
	display: flex;
	justify-content: center;
	opacity: 0;
	transition: opacity 0.2s ease-out;
	pointer-events: auto;
}

.sizerContainer:hover {
	opacity: 1;
}

.sizer {
	width: 32px;
	height: 4px;
	margin: 1px;
	background: #d9d9d9;
	border-radius: 4px;
	cursor: grab;
	opacity: 0.3;
	transition: opacity 0.2s ease-out, background 0.2s ease-out;
}

.sizer:active {
	cursor: grabbing;
}

.sizer:hover {
	background: #ffffff;
	opacity: 1;
}
</style>
