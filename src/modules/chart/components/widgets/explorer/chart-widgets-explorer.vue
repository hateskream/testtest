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
	itemSelected: [sectionId: string | null, item: string | null];
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
	emit('itemSelected', section, item);
});
</script>

<template>
	<chart-common-widget-layout>
		<template #header>
			Explorer
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
							<div
								:class="[
									classes.sectionRow,
									{ [classes.sectionRowActive]: activeSection === section.id }
								]"
								@click="toggleSection(section.id)"
							>
								<div :class="classes.dropdownIconContainer">
									<ui-icon
										:id="IconIds.DropdownDown"
										width="20px"
										height="20px"
										:class="[
											classes.chevronIcon,
											{ [classes.chevronRotated]: activeSection === section.id }
										]"
									/>
								</div>
								<div :class="classes.sectionWrapper">
									<div :class="classes.iconContainer">
										<ui-icon
											:id="IconIds.Deals"
											:class="classes.sectionIcon"
											width="20px"
											height="20px"
										/>
									</div>
									<span :class="classes.sectionTitle">{{ section.title }}</span>
								</div>
							</div>
						</div>

						<transition
							:enter-active-class="classes.slideEnterActive"
							:leave-active-class="classes.slideLeaveActive"
							:enter-from-class="classes.slideEnterFrom"
							:leave-to-class="classes.slideLeaveTo"
							:enter-to-class="classes.slideEnterTo"
							:leave-from-class="classes.slideLeaveFrom"
						>
							<div v-if="activeSection === section.id">
								<div
									v-for="(item, index) in section.items"
									:key="index"
									:class="[
										classes.sectionRow,
										{ [classes.sectionRowActive]: selectedItem === item.id }
									]"
									@click="selectItem(item.id)"
								>
									<div :class="classes.dropdownIconContainer" />
									<div :class="classes.sectionWrapper">
										<div :class="classes.iconContainer">
											<ui-icon
												:id="IconIds.Deals"
												:class="classes.sectionIcon"
												width="20px"
												height="20px"
											/>
										</div>
										<span :class="classes.sectionTitle">{{ item.title }}</span>
									</div>
								</div>
							</div>
						</transition>
					</div>
				</div>
			</div>
		</template>
	</chart-common-widget-layout>
</template>

<style module="classes">
.accordionContent {
	height: 384px;
	padding: 0 8px 8px;
	overflow: hidden;

	.scrollContainer {
		height: 100%;
		overflow-y: auto;

		.sectionHeader {
			position: sticky;
			top: 0;
			z-index: 10;
			background-color: transparent;
		}

		.sectionRow {
			display: flex;
			align-items: center;
			width: 100%;
			padding: 3px 0;
			text-align: left;
			color: var(--text-color-base-500);
			cursor: pointer;
			transition: all 0.15s ease-in-out;

			.dropdownIconContainer {
				position: relative;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 30px;
				height: 30px;

				.chevronIcon {
					flex-shrink: 0;
					width: 18px;
					height: 18px;
					color: #7a7a7a;
					transform: rotate(-90deg);
					transition: transform 0.15s ease-in-out;

					&.chevronRotated {
						transform: rotate(0deg);
					}
				}
			}

			.sectionWrapper {
				display: flex;
				align-items: center;
				width: 100%;
				padding: 5px 6px;
				font-weight: 300;
				font-size: 12px;
				line-height: 18px;
				border-radius: 10px;
				gap: 2px;
			}

			&.sectionRowActive {
				.sectionWrapper {
					background-color: rgb(51 51 51 / 80%);
					opacity: 1;

					.iconContainer {
						.sectionIcon {
							color: var(--text-color-base-500);
						}
					}
				}
			}

			&:not(.sectionRowActive):hover {
				.sectionWrapper {
					background-color: rgb(64 64 64 / 40%);

					.iconContainer {
						.sectionIcon {
							color: var(--text-color-base-500);
						}
					}
				}
			}

			.iconContainer {
				display: flex;
				flex-shrink: 0;
				justify-content: center;
				align-items: center;
				width: 20px;
				height: 20px;

				.sectionIcon {
					color: var(--text-color-base-300);
				}
			}

			.sectionTitle {
				flex: 1;
			}
		}
	}
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

</style>
