<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';

import type { ISection, IWidget, ISectionWheelPayload } from '../model';
import { calcSizeSideGridCell } from '../model/widget';
import { MIN_COL_WIDTH, MAX_COL_WIDTH } from '../../tv';
import { UiSkeleton } from '@/shared/ui/skeleton';
import { smoothScrollTo } from '@/shared/lib/smooth-scroll.ts';

import WidgetComponent from './widget-component.vue';

const WIDGET_GAP = 6;
const WIDGET_GAP_PX = `${WIDGET_GAP}px`;

const HEIGHT_TITLE = 50;

const HEIGHT_ROUNDING_BOTTOM = 25;

interface IPreparedWidget extends IWidget {
	isVisible: boolean;
}

interface ISectionComponentProps {
	section: ISection;
	parentHeight: number;
	isVisible: boolean;
}

const props = defineProps<ISectionComponentProps>();

const emits = defineEmits<{
	'section-wheel': [ISectionWheelPayload];
}>();

const widgetRefs = ref<InstanceType<typeof WidgetComponent>[]>([]);

const preparedWidgets = ref<IPreparedWidget[]>([]);

const scrollRef = useTemplateRef('scroll');

const lastWidget = computed(() => widgetRefs.value[widgetRefs.value.length - 1]);

const cardStyle = computed(() => ({ width: `${props.section.width}px`, maxWidth: `${props.section.width}px` }));

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

const height = computed(() => {
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

const seenWidgets = new Set<number>();

const visibleWidgetsWithAccumulation = computed(() => {
	const container = scrollRef.value;
	if (!container) {
		return seenWidgets.size;
	}

	let acc = HEIGHT_TITLE;
	let index = 0;

	while (index < props.section.widgets.length && acc < container.clientHeight + scrollTop.value) {
		acc += props.section.widgets[index].height + WIDGET_GAP;
		index++;
	}

	for (let i = 0; i < index; i++) {
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
		if (newCount === oldCount || newCount < oldCount) {
			return;
		}
		prepare(props.section.widgets, newCount);
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
		updateScrollTop(deltaY);
		emitScrollInfo();
		return;
	}
}

function updateScrollTop(deltaY: number) {
	if (!scrollRef.value) {
		return;
	}
	scrollRef.value.scrollTop += deltaY;
	scrollTop.value = scrollRef.value.scrollTop;
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
}

onMounted(() => {
	emitScrollInfo();
});

defineExpose({
	scrollToWidget,
});
</script>

<template>
	<section
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
				<h2 :class="classes.sectionTitle">
					{{ props.section.name }}
				</h2>

				<div :class="classes.widgets">
					<widget-component
						v-for="widget in preparedWidgets"
						:key="widget.id"
						ref="widgetRefs"
						:widget="widget"
						:col-count="cellSize.count"
						:column-width="cellSize.size"
						:parent-height="height"
						:active-display-variant="widget.displayVariant"
						:all-display-variants="widget.displayVariants"
						:is-visible="widget.isVisible"
					/>
				</div>
			</div>
		</div>
	</section>
</template>

<style module="classes">
.section {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	overflow: auto;
	color: #ffffff;
}

.sectionTitle {
	padding: 12px 0;
	font-style: normal;
	font-weight: 440;
	font-size: 16.8px;
	line-height: 160%; /* 26.88px */
	color: #ffffff;
	letter-spacing: 0.134px;
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
	overflow: hidden;
}

.widgetsContainer {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	overflow-y: auto;
	scrollbar-width: none;
	overscroll-behavior: contain;
}

.widgets {
	display: flex;
	flex-direction: column;
	border-radius: 24px;
	gap: v-bind(WIDGET_GAP_PX);
	/* stylelint-disable-next-line color-named */
	mask-image:
		radial-gradient(circle 24px at top left, transparent 0, black 0),
		radial-gradient(circle 24px at top right, transparent 0, black 0),
		linear-gradient(black, black);
	mask-composite: intersect;
}

@media (max-width: 768px) {
	.section {
		padding: 12px 12px 0;
	}
}
</style>
