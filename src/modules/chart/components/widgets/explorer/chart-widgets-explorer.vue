<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { useScroll, useEventListener } from '@vueuse/core';

import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import type { ISectionItem } from './models';

interface IChartWidgetsExplorerProps {
	sections: ISectionItem[];
}

const props = defineProps<IChartWidgetsExplorerProps>();
const activeSection = ref<string | null>(null);
const selectedItem = ref<string | null>(null);
const scrollContainerRef = ref<HTMLElement | null>(null);

const emit = defineEmits<{
	sectionToggled: [sectionId: string | null];
	itemSelected: [sectionId: string, item: string];
}>();

const { arrivedState } = useScroll(scrollContainerRef, {
	throttle: 16,
});

const toggleSection = (sectionId: string) => {
	activeSection.value = activeSection.value === sectionId ? null : sectionId;
	if (activeSection.value !== sectionId) {
		selectedItem.value = null;
	}
};

const selectItem = (item: string) => {
	selectedItem.value = item;
};

const forceScrollBoundaryUpdate = async () => {
	await nextTick();
	const container = scrollContainerRef.value;
	if (container) {
		const currentScrollTop = container.scrollTop;
		container.scrollTop = currentScrollTop + 0.1;
		container.scrollTop = currentScrollTop;
	}
};

useEventListener(scrollContainerRef, 'wheel', (event: WheelEvent) => {
	const container = scrollContainerRef.value;
	if (!container) {
		return;
	}

	const { scrollTop, scrollHeight, clientHeight } = container;
	const isAtTop = scrollTop <= 1;
	const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

	const { top, bottom } = arrivedState;
	const atTop = container ? isAtTop : top;
	const atBottom = container ? isAtBottom : bottom;

	if (atTop && event.deltaY < 0) {
		event.preventDefault();
		return;
	}

	if (atBottom && event.deltaY > 0) {
		event.preventDefault();
		return;
	}

	event.stopPropagation();
});

watch(activeSection, async (newSection) => {
	emit('sectionToggled', newSection);
	await forceScrollBoundaryUpdate();
});

watch([activeSection, selectedItem], ([section, item]) => {
	if (section && item) {
		emit('itemSelected', section, item);
	}
});
</script>

<template>
	<chart-common-widget-layout>
		<template #header>
			<div :class="classes.header">
				<div :class="classes.navTabs">
					<button :class="[classes.navTab, classes.active]">Explore</button>
					<button :class="classes.navTab">My notes</button>
				</div>
			</div>
		</template>
		<template #body>
			<div :class="classes.accordionContent">
				<div
					ref="scrollContainerRef"
					:class="classes.scrollContainer"
					@scroll.stop
				>
					<div
						v-for="section in props.sections"
						:key="section.id"
						:class="classes.section"
					>
						<div :class="classes.sectionHeader">
							<button
								:class="[
									classes.sectionButton,
									{ [classes.sectionButtonActive]: activeSection === section.id }
								]"
								@click="toggleSection(section.id)"
							>
								<ui-icon
									:id="IconIds.DropdownDown"
									width="12"
									height="12"
									:class="[
										classes.chevronIcon,
										{ [classes.chevronRotated]: activeSection === section.id }
									]"
								/>
								<div :class="classes.iconContainer">
									<ui-icon
										:id="IconIds.Deals"
										:class="classes.sectionIcon"
									/>
								</div>
								<span :class="classes.sectionTitle">{{ section.title }}</span>
							</button>
						</div>

						<transition
							:enter-active-class="classes.slideEnterActive"
							:leave-active-class="classes.slideLeaveActive"
							:enter-from-class="classes.slideEnterFrom"
							:leave-to-class="classes.slideLeaveTo"
							:enter-to-class="classes.slideEnterTo"
							:leave-from-class="classes.slideLeaveFrom"
						>
							<div v-if="activeSection === section.id" :class="classes.sectionItems">
								<button
									v-for="(item, index) in section.items"
									:key="index"
									:class="[
										classes.itemButton,
										{ [classes.itemButtonSelected]: selectedItem === item }
									]"
									@click="selectItem(item)"
								>
									<div :class="classes.iconContainer">
										<ui-icon
											:id="IconIds.Deals"
											:class="classes.itemIcon"
										/>
									</div>
									<span :class="classes.itemText">{{ item }}</span>
								</button>
							</div>
						</transition>
					</div>
				</div>
			</div>
		</template>
	</chart-common-widget-layout>
</template>

<style module="classes">
.accordionContainer {
	width: 20rem;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
	color: white;
	background-color: black;
}

.header {
	padding: 1rem;
	border-bottom: 1px solid gray;
}

.navTabs {
	display: flex;
	gap: 1.5rem;
}

.navTab {
	padding: 0;
	font-weight: 500;
	font-size: 0.875rem;
	color: gray;
	background: none;
	border: none;
	cursor: pointer;
	transition: all 0.15s ease-in-out;

	&:hover {
		color: white;
	}

	&.active {
		color: white;
	}
}

.accordionContent {
	height: 24rem;
	overflow: hidden;
}

.scrollContainer {
	height: 100%;
	overflow-y: auto;
}

.section {
	border-bottom: 1px solid darkgray;
}

.sectionHeader {
	position: sticky;
	top: 0;
	z-index: 10;
	background-color: black;
}

.sectionButton {
	display: flex;
	align-items: center;
	width: 100%;
	padding: 1rem;
	text-align: left;
	color: white;
	background: none;
	border: none;
	cursor: pointer;
	transition: all 0.15s ease-in-out;
	gap: 0.75rem;

	&:hover {
		background-color: darkgray;
	}

	&.sectionButtonActive {
		background-color: darkgray;
	}
}

.chevronIcon {
	flex-shrink: 0;
	width: 1.125rem;
	height: 1.125rem;
	transform: rotate(-90deg);
	transition: transform 0.15s ease-in-out;

	&.chevronRotated {
		transform: rotate(0deg);
	}
}

.iconContainer {
	display: flex;
	flex-shrink: 0;
	justify-content: center;
	align-items: center;
	width: 1.5rem;
	height: 1.5rem;
	background-color: gray;
	border-radius: 50%;
}

.sectionIcon {
	width: 1.25rem;
	height: 1.25rem;
}

.itemIcon {
	width: 1rem;
	height: 1rem;
}

.sectionTitle {
	flex: 1;
	font-weight: 500;
}

.sectionItems {
	background-color: darkgray;
}

.itemButton {
	display: flex;
	align-items: center;
	width: 100%;
	padding: 0.75rem;
	padding-left: 3rem;
	text-align: left;
	color: white;
	background: none;
	border: none;
	cursor: pointer;
	transition: all 0.15s ease-in-out;
	gap: 0.75rem;

	&:hover {
		background-color: gray;
	}

	&.itemButtonSelected {
		background-color: gray;
	}
}

.itemText {
	font-size: 0.875rem;
	color: lightgray;
}

.slideEnterActive,
.slideLeaveActive {
	overflow: hidden;
	transition: all 0.3s ease;
}

.slideEnterFrom,
.slideLeaveTo {
	max-height: 0;
	opacity: 0;
}

.slideEnterTo,
.slideLeaveFrom {
	max-height: 500px;
	opacity: 1;
}

button {
	font-family: inherit;

	&:focus {
		outline: 2px solid blue;
		outline-offset: 2px;
	}
}
</style>
