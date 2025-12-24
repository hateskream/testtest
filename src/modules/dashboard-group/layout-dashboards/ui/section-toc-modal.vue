<script setup lang="ts">
import draggable from 'vuedraggable';

import type { ISection, IWidget } from '../model';
import {
	DashboardModalContent,
	DashboardModalTitle,
	DashboardModalWrapper,
} from '@/shared/ui/modal';
import { isFeatureEnabled } from '@/shared/lib';
import { UiText } from '@/shared/ui/text';
import { UiPositionTooltip } from '@/shared/ui/position';

import SectionTocModalTooltipContent
	from '@/modules/dashboard-group/layout-dashboards/ui/section-toc-modal-tooltip-content.vue';

const props = defineProps<{
	slides: ISection[];
}>();

const emits = defineEmits<{
	'go-to': [number];
	'scroll-to-widget': [string, string];
	'change-order-widgets-in-section': [string, IWidget[]];
	'change-order-sections': [ISection[]];
}>();

function updateSections(v: ISection[]) {
	emits('change-order-sections', v);
}

function updateWidgets(sectionId: string, widgets: IWidget[]) {
	if (!isFeatureEnabled('DRAG_WIDGET_ENABLED')) {
		return;
	}

	emits('change-order-widgets-in-section', sectionId, widgets);
}
</script>

<template>
	<dashboard-modal-wrapper>
		<dashboard-modal-title bordered>
			Table of contents
		</dashboard-modal-title>
		<dashboard-modal-content>
			<div :class="classes.toc">
				<draggable
					:model-value="props.slides"
					item-key="id"
					handle=".section-title"
					:animation="200"
					:ghost-class="classes.ghost"
					:chosen-class="classes.chosen"
					:drag-class="classes.drag"
					@update:model-value="updateSections"
				>
					<template #item="{ element: section, index }">
						<div :class="classes.section">
							<ui-text
								:class="[classes.title, 'section-title']"
								token="text-200-r"
								@click.stop="emits('go-to', index)"
							>
								{{ section.name }}
							</ui-text>
							<draggable
								:model-value="section.widgets"
								item-key="id"
								:animation="200"
								group="widgets"
								:ghost-class="classes.ghost"
								:chosen-class="classes.chosen"
								:drag-class="classes.drag"
								:class="classes.widgets"
								@update:model-value="(v: IWidget[]) => updateWidgets(section.id, v)"
							>
								<template #item="{ element: widget }">
									<ui-position-tooltip>
										<template #default="{close}">
											<ui-text
												:class="classes.widget"
												as="div"
												token="text-200-r"
												@click.stop="emits('scroll-to-widget', section.id, widget.id)"
												@pointerdown.capture="close"
											>
												{{
													widget.name
												}} <span v-if="widget.stateType">— {{ widget.stateType }}</span>
											</ui-text>
										</template>

										<template #content>
											<section-toc-modal-tooltip-content />
										</template>
									</ui-position-tooltip>
								</template>
							</draggable>
						</div>
					</template>
				</draggable>
			</div>
		</dashboard-modal-content>
	</dashboard-modal-wrapper>
</template>

<style module="classes">
.toc {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: var(--padding-padding-s5, 8px);
	padding: 4px 10px 22px;
}

.section {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.title {
	margin-bottom: 8px;
	padding: 0 8px;
	color: var(--text-500, rgb(255 255 255 / 96%));
	border-radius: var(--radius-radius-s12-24, 9.2px);
	cursor: pointer;
}

.widgets {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 100%;
	padding:
		var(--padding-padding-s0, 0)
		var(--padding-padding-s0, 0)
		var(--padding-padding-s5, 8px)
		var(--padding-padding-s9, 16px);
	gap: var(--padding-padding-s5, 8px);
}

.ghost {
	transform: scale(0.98);
	opacity: 0.4;
}

.chosen {
	opacity: 0.8;
}

.drag {
	transform: scale(0.97);
	cursor: grabbing;
	opacity: 0.6;
	user-select: none;
}

.widget {
	padding: 0 8px;
	color: var(--text-500, rgb(255 255 255 / 96%));
	border-radius: var(--radius-radius-s12-24, 9.2px);
	cursor: pointer;
}

.widget,
.title {
	transition: background-color 0.12s ease-in-out;
}

.widget:hover,
.title:hover {
	background: var(--atom-base-20, rgb(73 73 80 / 80%));
}
</style>
