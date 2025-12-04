<script setup lang="ts">
import { computed } from 'vue';

import { PositionContent, PositionRoot, PositionTeleport, PositionTrigger } from '@/shared/ui/position';
import { UiPresence } from '@/shared/ui/presence';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import type { ISection, ISectionWheelPayload } from '../model';

import SectionTocModal from './section-toc-modal.vue';

const props = defineProps<{
	slides: ISection[];
	slidesWheel: Record<string, ISectionWheelPayload>;
	currentIndex: number;
	canPrev: boolean;
	canNext: boolean;
}>();

const emits = defineEmits<{
	prev: [];
	next: [];
	'go-to': [number];
	'update-section': [ISection[]];
	'scroll-to-widget': [string, string];
}>();

const sticks = computed(() =>
	props.slides.flatMap((section, secIndex) => [
		{
			id: section.id,
			type: 'section' as const,
			index: secIndex,
		},
		...section.widgets.map((widget, widgetIndex) => ({
			id: widget.id,
			index: widgetIndex,
			type: 'widget' as const,
			sectionIndex: secIndex,
			sectionId: section.id,
		})),
	]),
);

const activeStickIndex = computed(() => {
	if (!props.canNext) {
		return -1;
	}

	const sectionId = props.slides[props.currentIndex].id;
	const wheel = props.slidesWheel[sectionId];

	if (!wheel || wheel.passedWidgets === 0) {
		return sticks.value.findIndex(
			(s) => s.type === 'section' && s.index === props.currentIndex,
		);
	}

	const passedIndex = wheel.passedWidgets - 1;

	return sticks.value.findIndex(
		(s) =>
			s.type === 'widget' &&
			s.sectionId === sectionId &&
			s.index === passedIndex,
	);
});

function isActiveStick(index: number) {
	return index === activeStickIndex.value;
}

async function handleStickClick(stick: typeof sticks.value[number]) {
	if (stick.type === 'section') {
		emits('go-to', stick.index);
	} else {
		emits('scroll-to-widget', stick.sectionId, stick.id);
	}
}


</script>

<template>
	<div :class="classes.content">
		<button
			:disabled="!props.canPrev"
			:class="classes.control"
			@click="emits('prev')"
		>
			<ui-icon :id="IconIds.Prev" />
		</button>
		<button
			:disabled="!props.canNext"
			:class="classes.control"
			@click="emits('next')"
		>
			<ui-icon
				:id="IconIds.Prev"
				:style="{
					transform: `rotate(180deg)`
				}"
			/>
		</button>

		<position-root
			:trigger="['hover', 'click']"
			:close-delay="24"
			v-slot="{isOpen}"
		>
			<position-trigger>
				<div :class="classes.nav">
					<div
						v-for="(stick, i) in sticks"
						:key="stick.id"
						:class="classes.stickWrapper"
						@click.stop="handleStickClick(stick)"
					>
						<div
							:class="[
								classes.progressStick,
								{
									[classes.progressStickFull]: stick.type === 'section',
									[classes.progressStickActive]: isActiveStick(i)
								}
							]"
						/>
					</div>
					<div :class="[classes.stickWrapper, classes.end]">
						<div
							:class="[
								classes.progressStick,
								[classes.progressStickFull],
								{
									[classes.progressStickActive]: !props.canNext
								}
							]"
						/>
					</div>
				</div>
			</position-trigger>

			<position-teleport to="#slider" defer>
				<ui-presence :state="isOpen" v-slot="{present}">
					<transition name="slide-from">
						<position-content
							v-if="present"
							placement="left-start"
							:offset="-14"
							:transform="false"
							:class="classes.positionContent"
						>
							<section-toc-modal
								:slides="props.slides"
								@scroll-to-widget="(e1, e2) => emits('scroll-to-widget', e1, e2)"
								@update-section="emits('update-section', $event)"
								@go-to="emits('go-to', $event)"
							/>
						</position-content>
					</transition>
				</ui-presence>
			</position-teleport>
		</position-root>
	</div>
</template>

<style module="classes">
.content {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	min-width: 52px;
	height: 100%;
	padding-top: 10px;
	background: rgb(0 0 0 / 74%);
	gap: 8px;
	backdrop-filter: blur(12px);
}

.control {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 24px;
	height: 24px;
	color: rgb(255 255 255 / 50%);
	background: rgb(73 73 80 / 32%);
	border-radius: 8px;
	backdrop-filter: blur(4px);
	cursor: pointer;
}

.control:disabled {
	color: rgb(255 255 255 / 50%);
	background: rgb(73 73 80 / 32%);
	border-radius: 8px;
	cursor: not-allowed;
	opacity: 0.7;
	backdrop-filter: blur(4px);
}

.control:hover {
	color: rgb(255 255 255 / 100%);
	background: rgb(73 73 80 / 32%);
	border-radius: 8px;
	backdrop-filter: blur(4px);
}

.nav {
	position: absolute;
	top: 50%;
	left: 50%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-end;
	width: 44px;
	padding: 40px 12px;
	transform: translate(-50%, -50%);
}

.stickWrapper {
	padding: 4.5px 0;
	cursor: pointer;
}

.progressStick {
	width: 9px;
	height: 1px;
	background: var(--contrast-contrast-60, rgb(255 255 255 / 40%));
	border-radius: var(--radius-radius-full, 9999px);
	transition: all 0.12s ease;
}

.progressStickFull {
	width: 16px;
	background: var(--contrast-contrast-60, rgb(255 255 255 / 40%));
}

.positionContent {
	z-index: 9;
}

.progressStickActive,
.stickWrapper:hover .progressStick {
	background: var(--icon-500, #ffffff);
}
</style>

<style scoped>
.slide-from-enter-from {
	transform: translateX(400px);
	opacity: 0;
}

.slide-from-enter-active {
	transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-from-leave-active {
	transition: transform 0.2s ease-out;
}

.slide-from-enter-to {
	transform: translateX(0);
}

.slide-from-leave-from {
	transform: translateX(0);
}

.slide-from-leave-to {
	transform: translateX(350px);
}
</style>
