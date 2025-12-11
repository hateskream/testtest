<script setup lang="ts">
import draggable from 'vuedraggable';
import { ref, watch } from 'vue';

import type { ISection, IWidget } from '../model';
import {
	DashboardModalContent,
	DashboardModalTitle,
	DashboardModalWrapper,
} from '@/shared/ui/modal';
import { isFeatureEnabled } from '@/shared/lib';

const props = defineProps<{
	slides: ISection[];
}>();

const emits = defineEmits<{
	'go-to': [number];
	'scroll-to-widget': [string, string];
	'update-section': [ISection[]];
}>();

const localSections = ref<ISection[]>([]);

watch(() => props.slides, (v) => {
	localSections.value = v.map(s => ({
		...s,
		widgets: [...s.widgets],
	}));
}, { immediate: true, deep: true });

function updateSections(v: ISection[]) {
	localSections.value = v.map(s => ({
		...s,
		widgets: [...s.widgets],
	}));

	emits('update-section', localSections.value);
}

function updateWidgets(sectionIndex: number, widgets: IWidget[]) {
	if (!isFeatureEnabled('DRAG_WIDGET_ENABLED')) {
		return;
	}

	const next = localSections.value.map((s, i) =>
		i === sectionIndex
			? { ...s, widgets: [...widgets] }
			: s,
	);

	localSections.value = next;
	emits('update-section', next);
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
							<div
								:class="[classes.title, 'section-title']"
								@click.stop="emits('go-to', index)"
							>
								{{ section.name }}
							</div>

							<draggable
								:model-value="section.widgets"
								item-key="id"
								:animation="200"
								group="widgets"
								:ghost-class="classes.ghost"
								:chosen-class="classes.chosen"
								:drag-class="classes.drag"
								:class="classes.widgets"
								@update:model-value="(v: IWidget[]) => updateWidgets(index, v)"
							>
								<template #item="{ element: widget }">
									<div
										:class="classes.widget"
										@click.stop="emits('scroll-to-widget', section.id, widget.id)"
									>
										{{ widget.name }} <span v-if="widget.stateType">— {{widget.stateType}}</span>
									</div>
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
	padding-bottom: 8px;
	font-style: normal;
	font-weight: 400;
	font-size: var(--font-text-200-r-size, 12.2px);
	line-height: 180%;
	color: var(--text-500, rgb(255 255 255 / 96%));
	letter-spacing: 0.122px;
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
	font-style: normal;
	font-weight: 400;
	font-size: var(--font-text-200-r-size, 12.2px);
	line-height: 180%;
	color: var(--text-500, rgb(255 255 255 / 96%));
	letter-spacing: 0.122px;
	border-radius: var(--radius-radius-s12-24, 9.2px);
	cursor: pointer;
}

.widget:hover {
	background: var(--atom-base-20, rgb(73 73 80 / 80%));
}
</style>
