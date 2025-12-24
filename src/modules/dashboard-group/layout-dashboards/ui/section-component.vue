<script setup lang="ts">
import { computed, onMounted, reactive, ref, useTemplateRef, watch } from 'vue';

import type { ISection, ISectionWheelPayload, IWidget } from '../model';
import { calcSizeSideGridCell } from '../model/widget';
import { MAX_COL_WIDTH, MIN_COL_WIDTH } from '../../tv';
import { UiSkeleton } from '@/shared/ui/skeleton';
import { smoothScrollTo } from '@/shared/lib/smooth-scroll.ts';
import { useResizable } from '../composables';
import { isFeatureEnabled } from '@/shared/lib';
import { UiText } from '@/shared/ui/text';
import { MIN_SECTION_WIDTH } from '../model/section';
import { useIsMobile } from '@/shared/composables';

import WidgetComponent from './widget-component.vue';
import HighlighterComponent from './highlighter-component.vue';

const WIDGET_GAP = 6;
const HEIGHT_TITLE = 50;
const HEIGHT_ROUNDING_BOTTOM = 25;

interface IPreparedWidget extends IWidget {
	isVisible: boolean;
}

interface ISectionComponentProps {
	section: ISection;
	parentHeight: number;
	isVisible: boolean;
	hasMarginLeft: boolean;
}

const props = defineProps<ISectionComponentProps>();

const emits = defineEmits<{
	'section-wheel': [ISectionWheelPayload];
	'set-widget-state-type': [string, string];
	'change-width': [string, number];
	'change-height': [string, string, number];
	'change-max-count-row': [string, string, number];
}>();

const { size } = useResizable(
	useTemplateRef('sizer'),
	useTemplateRef('section'),
	{
		minWidth: MIN_SECTION_WIDTH,
		isActivated: () => isFeatureEnabled('RESIZE_WIDTH_SECTIONS'),
	},
);

const widgetRefs = ref<InstanceType<typeof WidgetComponent>[]>([]);

const preparedWidgets = ref<IPreparedWidget[]>([]);

const scrollRef = useTemplateRef('scroll');

const lastWidget = computed(() => widgetRefs.value[widgetRefs.value.length - 1]);

const cardStyle = computed(() =>({
	width: `${props.section.width}px`,
	maxWidth: `${props.section.width}px`,
}));

const cellSize = computed(() => calcSizeSideGridCell(props.section.width, MIN_COL_WIDTH, MAX_COL_WIDTH));

const isOneInSection = computed(() => props.section.widgets.length === 1);
const heightWithoutLastWidget = computed(() =>
	props.section.widgets
		.slice(0, -1)
		.reduce((acc, num) => acc + num.height + WIDGET_GAP, HEIGHT_TITLE),
);

const isLastWidgetHasInfinityHeight = computed(() =>
	props.section.widgets?.[props.section.widgets.length - 1]?.height === Infinity,
);

const hasPaddingBottom = computed(() => !isOneInSection.value && !isLastWidgetHasInfinityHeight.value );

const heightSection = computed(() => {
	if (isOneInSection.value && isLastWidgetHasInfinityHeight.value) {
		// TODO: Серьезно обсудить с дизайном скроллинг одного бесконечного виджета
		return props.parentHeight - HEIGHT_TITLE;
	}

	return isLastWidgetHasInfinityHeight.value
		? props.parentHeight + HEIGHT_ROUNDING_BOTTOM
		: props.parentHeight;
});

function emitScrollInfo() {
	if (!scrollRef.value) {
		return;
	}

	const el = scrollRef.value;
	const scrollTop = Math.round(el.scrollTop);
	const total = widgetRefs.value.length;

	if (total === 1 || el.scrollHeight <= el.clientHeight) {
		emits('section-wheel', {
			sectionId: props.section.id,
			passedWidgets: total,
		});
		return;
	}

	let passed = 0;

	for (const w of widgetRefs.value) {
		const widgetEl = w.$el as HTMLElement;

		const widgetTop = Math.round(widgetEl.offsetTop);

		if (scrollTop >= widgetTop) {
			passed+=1;
		}
	}

	const remaining = Math.round(el.scrollHeight - el.clientHeight - scrollTop);
	if (remaining <= 2) {
		passed = total;
	}

	emits('section-wheel', {
		sectionId: props.section.id,
		passedWidgets: passed,
	});
}

const scrollTop = ref(0);

const seenWidgets = reactive(new Set<number>());

const visibleWidgetsWithAccumulation = computed(() => {
	const container = scrollRef.value;
	if (!container) {
		return seenWidgets.size;
	}

	let acc = HEIGHT_TITLE;
	let index = 0;

	while (index < props.section.widgets.length && acc < container.clientHeight + scrollTop.value) {
		acc += props.section.widgets[index].height + WIDGET_GAP;
		index+=1;
	}

	for (let i = 0; i < index; i+=1) {
		seenWidgets.add(i);
	}

	return seenWidgets.size;
});


watch(
	() => props.section.widgets,
	newWidgets => {
		if (visibleWidgetsWithAccumulation.value === 0) {
			return;
		}
		prepare(newWidgets, visibleWidgetsWithAccumulation.value);
	},
);

watch(
	visibleWidgetsWithAccumulation,
	(newCount, oldCount) => {
		if (newCount <= oldCount) {
			return;
		}
		prepare(props.section.widgets, newCount);
	},
);

watch(
	size,
	newWidth => {
		emits('change-width', props.section.id, newWidth);
	},
);

function prepare(newWidgets: IWidget[], visibleWindowSize: number) {
	preparedWidgets.value = newWidgets.map((w, i) => ({
		...w,
		isVisible: i < visibleWindowSize,
	}));
}

function onWheel(event: WheelEvent) {
	if (!scrollRef.value) {
		return;
	}

	if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
		return;
	}

	const { target, deltaY } = event;
	if (target === null || !(target instanceof HTMLElement)) {
		return;
	}

	if (isOneInSection.value) {
		event.preventDefault();

		lastWidget.value?.scrollBy(deltaY);
		return;
	}

	if (scrollRef.value.scrollTop < heightWithoutLastWidget.value) {
		event.preventDefault();

		scrollRef.value.scrollTop += deltaY;
		scrollTop.value = scrollRef.value.scrollTop;
		emitScrollInfo();
		return;
	}
}

async function scrollToWidget(widgetId: string) {
	if (!scrollRef.value) {
		return;
	}

	const el = scrollRef.value;

	const widget = widgetRefs.value.find(
		(w) => w.$props.widget.id === widgetId,
	);

	if (!widget) {
		return;
	}

	const widgetEl = widget.$el as HTMLElement;

	const containerTop = el.getBoundingClientRect().top;
	const widgetTop = widgetEl.getBoundingClientRect().top;
	const rawOffset = widgetTop - containerTop + el.scrollTop;

	const offset = Math.min(rawOffset, el.scrollHeight - el.clientHeight);

	const distance = Math.abs(offset - el.scrollTop);

	const scaleFactor = 300;
	const minDuration = 150;
	const maxDuration = 1200;

	const duration = Math.min(
		maxDuration,
		Math.max(
			minDuration,
			Math.max(minDuration, scaleFactor * Math.log(distance + 1)),
		),
	);

	await smoothScrollTo(el, offset, {
		duration,
		onUpdate: emitScrollInfo,
	});

	widget.triggerFlash();
}

function setWidgetStateType(widgetId: string, stateType: string) {
	emits('set-widget-state-type', widgetId, stateType);
}

function onChangeWidgetHeight(widgetId: string, height: number) {
	emits('change-height', props.section.id, widgetId, height);
}

function onChangeMaxCountRowWidget(widgetId: string, maxCountRow: number) {
	emits('change-max-count-row', props.section.id, widgetId, maxCountRow);
}

onMounted(() => {
	emitScrollInfo();
});

const flashRef = useTemplateRef('flash');

function triggerFlash() {
	flashRef.value?.trigger();
}
const isMobile = useIsMobile();

defineExpose({
	scrollToWidget,
	triggerFlash,
});
</script>

<template>
	<div
		:class="[classes.root, { [classes.mobileRoot]: isMobile }]"
		:style="{
			...props.hasMarginLeft ? { 'margin-left': '10px' } : {},
			...{ 'margin-right': '10px' }
		}"
	>
		<section
			ref="section"
			:class="classes.section"
			:style="cardStyle"
		>
			<ui-skeleton
				v-if="!props.isVisible"
				border-radius="24px"
				width="100%"
				height="100%"
			/>
			<div v-else :class="classes.scroll">
				<div
					ref="scroll"
					:class="classes.widgetsContainer"
					:style="{
						'padding-bottom': hasPaddingBottom ? '25px' : 0
					}"
					@wheel.capture="onWheel"
				>
					<ui-text
						:class="classes.sectionTitle"
						token="title-200"
						as="h2"
					>
						{{ props.section.name }}
					</ui-text>

					<div :class="classes.widgets">
						<highlighter-component ref="flash" />

						<widget-component
							v-for="widget in preparedWidgets"
							:key="widget.id"
							ref="widgetRefs"
							:widget="widget"
							:col-count="cellSize.count"
							:column-width="cellSize.size"
							:parent-height="heightSection"
							:active-display-variant="widget.displayVariant"
							:all-display-variants="widget.displayVariants"
							:is-visible="widget.isVisible"
							@set-widget-state-type="setWidgetStateType"
							@change-height="onChangeWidgetHeight"
							@change-max-count-row="onChangeMaxCountRowWidget"
						/>
					</div>
				</div>
			</div>
		</section>
	</div>
	<div
		ref="sizer"
		:class="classes.sizer"
	/>
</template>

<style module="classes">
.root {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	align-items: center;

	&.mobileRoot {
		.section {
			padding: 12px 12px 0;
		}

		.sectionTitle {
			padding: 0 0 12px 4px;
		}
	}
}

.section {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	overflow: auto;
	color: #ffffff;
	will-change: width;
	contain: layout size style;
}

.sizer {
	width: 4px;
	height: 32px;
	margin: auto;
	background: #d9d9d9;
	border-radius: 4px;
	cursor: grab;
	opacity: 0.3;
}

.sizer:active {
	cursor: grabbing;
}

.sizer:hover {
	background: #ffffff;
	opacity: 1;
}

.sectionTitle {
	padding: 12px 0;
	color: #ffffff;
}

.loader {
	display: flex;
	flex-grow: 1;
	justify-content: center;
	align-items: center;
}

.scroll {
	position: relative;
	flex-grow: 1;
}

.widgetsContainer {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	overflow-y: scroll;
	user-select: none;
	scrollbar-width: none;
	overscroll-behavior-y: contain;
	overscroll-behavior-x: auto;
}

.widgetsContainer::-webkit-scrollbar {
	width: 0;
	height: 0;
}

.widgets {
	position: relative;
	display: flex;
	flex-direction: column;
	border-radius: 24px;
	/* stylelint-disable-next-line color-named */
	mask-image:
		radial-gradient(circle 24px at top left, transparent 0, black 0),
		radial-gradient(circle 24px at top right, transparent 0, black 0),
		linear-gradient(black, black);
	mask-composite: intersect;
}

.flash {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 10;
	pointer-events: none;
	touch-action: none;
}

.flash.active {
	animation: widget-flash 700ms ease-out;
}

@keyframes widget-flash {
	0% {
		background-color: transparent;
	}

	20% {
		background-color: rgb(255 255 255 / 25%);
	}

	100% {
		background-color: transparent;
	}
}

</style>
