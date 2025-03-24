<script setup lang="ts">
import { ref, computed, unref, watchEffect } from 'vue';
import { useFloating } from '@floating-ui/vue';

const WIDTH_CONTENT = 600;
const WIDTH_ARROW = 12;
const WIDTH_CONTENT_AND_ARROW = WIDTH_CONTENT + WIDTH_ARROW;

interface IDescriptionTooltipProps {
	title: string;
	description?: string;
}

const props = defineProps<IDescriptionTooltipProps>();

const isMouseOverTooltip = ref(false);

const reference = ref<HTMLDivElement | null>(null);
const floating = ref<HTMLDivElement | null>(null);

const currentPlacement = ref<'right-start' | 'left-start'>('right-start');

const isShowContentTooltip = computed((): boolean => !!props.description);

const { floatingStyles } = useFloating(reference, floating, {
	open: isShowContentTooltip,
	placement: currentPlacement,
});

const currentStyle = computed(() => {
	const style = unref(floatingStyles);

	if (currentPlacement.value === 'left-start') {
		style.left = `-${WIDTH_ARROW}px`;
	} else {
		style.left = `${WIDTH_ARROW}px`;
	}

	return style;
});

const classList = computed(
	(): Record<string, boolean> => ({
		[`description-areas-of-activity-tooltip__left`]: currentPlacement.value === 'left-start',
	}),
);

watchEffect(() => {
	if (!reference.value || !floating.value) {
		return;
	}

	const { left: leftReference } = reference.value.getBoundingClientRect();

	if (leftReference < WIDTH_CONTENT_AND_ARROW) {
		currentPlacement.value = 'right-start';
	} else {
		currentPlacement.value = 'left-start';
	}
});

function onMouseEnterTooltip() {
	isMouseOverTooltip.value = true;
}

function onMouseLeaveTooltip() {
	isMouseOverTooltip.value = false;
}
</script>

<template>
	<div>
		<div ref="reference">
			<slot />
		</div>
		<transition name="fade">
			<div
				v-if="isShowContentTooltip"
				ref="floating"
				class="description-areas-of-activity-tooltip"
				:style="currentStyle"
				:class="classList"
				@mouseenter="onMouseEnterTooltip"
				@mouseleave="onMouseLeaveTooltip"
			>
				<div class="description-areas-of-activity-tooltip__arrow" />
				<div
					class="description-areas-of-activity-tooltip__wrapper"
					:style="{ width: `${WIDTH_CONTENT}px` }"
				>
					<div class="description-areas-of-activity-tooltip__wrapper-title">
						<div class="description-areas-of-activity-tooltip__wrapper-title-text">
							{{ props.title }}
						</div>
					</div>
					<div
						class="description-areas-of-activity-tooltip__wrapper-content"
						v-html="props.description"
					/>
				</div>
			</div>
		</transition>
	</div>
</template>

<style scoped>
.description-areas-of-activity-tooltip {
	position: relative;
	z-index: 1;
}

.description-areas-of-activity-tooltip__arrow {
	content: '';
	position: absolute;
	top: 1px;
	left: -12px;
	width: 0;
	height: 0;
	border-top: 11px solid #37a7df;
	border-right: 6.5px solid transparent;
	border-left: 6.5px solid transparent;
	transform: rotate(90deg);
}

.description-areas-of-activity-tooltip__arrow::after {
	content: '';
	position: absolute;
	top: -16px;
	left: -6.5px;
	width: 13px;
	height: 5px;
	background-color: #37a7df;
}

.description-areas-of-activity-tooltip__arrow::before {
	content: '';
	position: absolute;
	top: -20px;
	left: -12px;
	width: 40px;
	height: 40px;
}

.description-areas-of-activity-tooltip__left .description-areas-of-activity-tooltip__arrow {
	top: 1px;
	left: 599px;
	transform: rotate(270deg);
}

.description-areas-of-activity-tooltip__left .description-areas-of-activity-tooltip__arrow::before {
	left: -27px;
}

.description-areas-of-activity-tooltip__left .description-areas-of-activity-tooltip__wrapper {
	box-shadow: 0 4px 6px 0 #0000004d;
}

.description-areas-of-activity-tooltip__wrapper {
	background-color: #ffffff;
	border: 2px solid #37a7df;
	border-radius: 5px;
	box-shadow: 0 4px 6px 0 #0000004d;
}

.description-areas-of-activity-tooltip__wrapper-title {
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px;
}

.description-areas-of-activity-tooltip__wrapper-title-text {
	position: relative;
	left: 60px;
	font-weight: 700;
	font-size: 13px;
	line-height: 15.73px;
	/* stylelint-disable-next-line font-family-no-missing-generic-family-keyword */
	font-family: 'Inter';
	color: #37a7df;
}

.description-areas-of-activity-tooltip__wrapper-content {
	padding: 10px 20px;
	font-weight: 400;
	font-size: 13px;
	line-height: 15.73px;
	/* stylelint-disable-next-line font-family-no-missing-generic-family-keyword */
	font-family: 'Inter';
}

.description-areas-of-activity-tooltip__wrapper-show-all {
	padding: 0 20px 20px;
	font-weight: 400;
	font-size: 13px;
	line-height: 16.84px;
	/* stylelint-disable-next-line font-family-no-missing-generic-family-keyword */
	font-family: 'PT Sans';
	text-align: right;
	color: #37a7df;
	text-decoration: underline;
	cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
