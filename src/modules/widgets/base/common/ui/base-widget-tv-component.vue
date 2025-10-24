<script setup lang="ts">
import { computed, ref, useCssModule, useSlots, h } from 'vue';

import { createResizeContext } from '../composables/use-resize-context';
import { useGlobalRcm } from '../composables/use-rcm';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { WidgetContextMenu, WidgetContextMenuFullView } from '../../modal';
import { FullViewDashboard, type IMeta } from '@/modules/dashboard-group';

interface IBaseDashboardComponentProps {
	meta: IMeta;
	hasReset: boolean;
}

const props = defineProps<IBaseDashboardComponentProps>();

const emits = defineEmits<{
	(e: 'duplicate'): void;
	(e: 'openFull'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'reset'): void;
	(e: 'delete'): void;
	(e: 'apply-changes'): void;
}>();

defineSlots<{
	title(): unknown;
	content(): unknown;
	rcm(): unknown;
}>();

createResizeContext(props.meta.isResizing);

const classes = useCssModule('classes');
const slots = useSlots();

const { open: openRcm, close: closeRcm } = useGlobalRcm(props.meta.widgetId);
const { open: openRcmFull } = useGlobalRcm(props.meta.widgetId);

const isOpenFullView = ref(false);

const classList = computed(() => ({
	[classes.resizing]: props.meta.isResizing,
	[classes.notResizing]: !props.meta.isResizing,
}));

const isShowControlMore = computed(() => {
	if (!props.meta.isOpenFull) {
		return true;
	}

	return slots.filter ;
});

/*
	TODO: Change render function to something better
	I know that this is SO BAD but idk how to pass ref from template that will not actually render
	Maybe we should create custom floating host in current template, but it's complex thing
	BTW, performance is so much better
 */
function onOpen(event: MouseEvent) {
	event.preventDefault();
	if (props.meta.isOpenFull) {
		openRcmFull(() =>
			h(
				WidgetContextMenuFullView,
				{
					onReset: () => emits('reset'),
					onApplyChanges: () => emits('apply-changes'),
				},
				{
					filter: slots.filter ? () => slots.filter?.({}) : undefined,
				},
			), event);
	} else {
		openRcm(() =>
			h(
				WidgetContextMenu,
				{
					dashboards: props.meta.dashboards,
					title: props.meta.name,
					onDelete: () => emits('delete'),
					onDuplicate: () => emits('duplicate'),
					onReset: () => emits('reset'),
					onMoveTo: (id: string) => emits('moveTo', id),
					onOpenFull: handleOpenFullView,
				},
				{
					filter: slots.filter ? () => slots.filter!({}) : undefined,
					'change-display': slots['change-display'] ? () => slots['change-display']!({}) : undefined,
					other: slots.other ? () => slots.other!({}) : undefined,
				},
			), event);
	}
}

function handleOpenFullView() {
	closeRcm();
	isOpenFullView.value = true;
}
</script>

<template>
	<div :class="[classes.container, classList]" @click.prevent.right="onOpen">
		<div :class="[classes.title, 'widget-drag', classList]">
			<div :class="classes.titleTextContainer">
				<div :class="classes.titleText">
					<slot name="title" />
				</div>
			</div>
			<div :class="classes.control">
				<ui-icon
					v-if="!props.meta.isOpenFull"
					:id="IconIds.ControlFullView"
					:class="classes.iconWrapper"
					width="20px"
					height="20px"
					@click="handleOpenFullView"
				/>
				<ui-icon
					v-if="isShowControlMore"
					:id="IconIds.ControlMore"
					:class="classes.iconWrapper"
					width="20px"
					height="20px"
					@click.prevent.left="onOpen"
				/>
				<teleport to="body">
					<full-view-dashboard
						v-model="isOpenFullView"
						:meta="props.meta"
					/>
				</teleport>
			</div>
		</div>
		<div :class="[classes.content, 'widget-no-drag']">
			<slot name="content" />
		</div>
	</div>
</template>

<style module="classes">
.iconWrapper {
	color: var(--icon-color-base-300);
	cursor: pointer;
}

.resizing {
	background-color: var(--bg-color-surface-02);
}

.notResizing {
	background-color: var(--bg-color-surface-01);
}

.container {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	overflow: hidden;
	border-radius: 18px;
}

.title {
	position: sticky;
	top: 0;
	z-index: 1;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px 8px 10px 16px;
	color: var(--text-color-base-300);
}

.titleTextContainer {
	overflow: hidden;
	font-weight: 300;
	font-size: 16px;
	color: var(--text-color-base-300);
	letter-spacing: 0.104px;
}

.titleText {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.content {
	display: flex;
	flex: 1;
	flex-direction: column;
	overflow: hidden;
	border-radius: inherit;
}

.control {
	display: flex;
	align-items: center;
	gap: 12px;
	opacity: 0;
	transition: opacity 0.3s ease;
}

.container:hover > .title > .control {
	opacity: 1;
}

.rcm {
	z-index: 101;
}
</style>
