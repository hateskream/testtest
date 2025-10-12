<script setup lang="ts">
import { computed, ref, useCssModule, useSlots, useTemplateRef } from 'vue';

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

createResizeContext(props.meta.isResizing);

const classes = useCssModule('classes');

const {
	isOpen: isVisibleRcm,
	handleOpen: openRcm,
	close: closeRcm,
	floatingStyles,
} = useGlobalRcm(props.meta.widgetId, useTemplateRef('rcm'));

const {
	isOpen: isVisibleRcmFull,
	handleOpen: openRcmFull,
	floatingStyles: floatingStylesFull,
} = useGlobalRcm(props.meta.widgetId, useTemplateRef('rcmFull'));

const slots = useSlots();

const isOpenFullView = ref(false);

const classList = computed(() => ({
	[classes.resizing]: props.meta.isResizing,
	[classes.notResizing]: !props.meta.isResizing,
}));

function onOpen(e: MouseEvent) {
	if (props.meta.isOpenFull) {
		openRcmFull(e);
	} else {
		openRcm(e);
	}
}

function handleOpenFullView() {
	closeRcm();
	isOpenFullView.value = true;
}
</script>

<template>
	<div :class="[classes.container, classList]" @click.prevent.right="onOpen">
		<div :class="[classes.title, 'widget-drag']">
			<div :class="classes.titleTextContainer">
				<div :class="classes.titleText">
					<slot name="title" />
				</div>
			</div>
			<div :class="classes.control">
				<ui-icon
					:id="IconIds.ControlMore"
					:class="classes.iconWrapper"
					width="20px"
					height="20px"
					@click.prevent.left="onOpen"
				/>
			</div>
		</div>
		<div :class="[classes.content, 'widget-no-drag']">
			<slot name="content" />
		</div>
		<teleport to="body">
			<div
				v-if="isVisibleRcm"
				ref="rcm"
				:class="classes.rcm"
				:style="floatingStyles"
			>
				<widget-context-menu
					:dashboards="meta.dashboards"
					:title="meta.name"
					@delete="emits('delete')"
					@duplicate="emits('duplicate')"
					@reset="emits('reset')"
					@move-to="emits('moveTo', $event)"
					@open-full="handleOpenFullView"
				>
					<template #filter v-if="slots.filter">
						<slot name="filter" />
					</template>
					<template #change-display v-if="slots['change-display']">
						<slot name="change-display" />
					</template>
					<template #other>
						<slot name="other" />
					</template>
				</widget-context-menu>
			</div>
			<div
				v-if="isVisibleRcmFull"
				ref="rcmFull"
				:style="{
					...floatingStylesFull,
					zIndex: 99999
				}"
				:class="classes.rcm"
			>
				<widget-context-menu-full-view
					@reset="emits('reset')"
					@apply-changes="emits('apply-changes')"
				>
					<template #filter v-if="slots.filter">
						<slot name="filter" />
					</template>
				</widget-context-menu-full-view>
			</div>
			<full-view-dashboard
				v-model="isOpenFullView"
				:meta="props.meta"
			/>
		</teleport>
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
	border-radius: 18px;
}

.title {
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
	flex: 1;
	overflow: hidden;
}

.control {
	display: flex;
	align-items: center;
	gap: 26px;
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
