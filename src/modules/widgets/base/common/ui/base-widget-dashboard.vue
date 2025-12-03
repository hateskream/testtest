<script setup lang="ts">
import { computed, ref, useSlots, useTemplateRef } from 'vue';

import { type DisplayVariant, FullViewDashboard, type IMeta } from '@/modules/dashboard-group';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { displayVariantToIcon, displayVariantToName } from '../model';
import { UiPosition } from '@/shared/ui/position';
import { ModalBadgeList, WidgetContextMenu } from '@/modules/widgets/base';
import { isFeatureEnabled } from '@/shared/lib';

import WidgetDashboardControls from './controls/widget-dashboard-controls.vue';


interface IBaseDashboardComponentProps {
	meta: IMeta;
	title: string;
	allDisplayVariants: DisplayVariant[];
}

const props = defineProps<IBaseDashboardComponentProps>();

const emits = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
	(e: 'reset'): void;
}>();

const isWidgetActionsEnabled = isFeatureEnabled('CONTEXT_MENU_WIDGET_ACTIONS');

const activeDisplayVariant = defineModel<DisplayVariant>('activeDisplayVariant', { required: true });

const MAX_DISPLAY_VARIANTS = 2;

const preparedAllDisplayVariants = computed(() =>
	props.allDisplayVariants.length > MAX_DISPLAY_VARIANTS
		? [props.allDisplayVariants[0]]
		: props.allDisplayVariants,
);

const countMore = computed(() => props.allDisplayVariants.length - preparedAllDisplayVariants.value.length);

const isFullscreen = ref<boolean>(false);
const isControlsExpanded = ref<boolean>(true);

/*
* filters is slot for toolbar view
* filter is slot for context menu modal
* */
defineSlots<{
	'filters': unknown;
	'content': unknown;

	'nav-menu': unknown;
	'settings-menu': unknown;
	'extra-menu': unknown;

	'change-display': unknown;
	'filter': unknown;
	'other': unknown;
}>();

const slots = useSlots();

const hasExpandedView = computed(() => {
	return !!(slots['change-display'] || slots['settings-menu'] || slots['nav-menu']);
});

const contextMenuRef = useTemplateRef('context-menu');

function handleFullscreen() {
	if (!isWidgetActionsEnabled) {
		return;
	}

	isFullscreen.value = true;
	contextMenuRef.value?.handleClose?.();
}
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.title">
			<div :class="classes.titleHeader">
				<div :class="classes.titleText">
					{{ props.title }}
				</div>

				<div
					v-if="props.allDisplayVariants.length > 1"
					:class="classes.displayVariantContainer"
				>
					<div
						v-for="displayVariant in preparedAllDisplayVariants"
						:key="displayVariant"
						:class="[
							classes.displayVariant,
							{
								[classes.activeDisplayVariant]: displayVariant === activeDisplayVariant,
							},
						]"
						@click="activeDisplayVariant = displayVariant"
					>
						<ui-icon :id="displayVariantToIcon[displayVariant]" />
						<div :class="classes.displayVariantText">{{ displayVariantToName[displayVariant] }}</div>
					</div>
					<div
						v-if="countMore > 1"
						:class="[classes.displayVariant, classes.displayVariantText]"
					>
						{{countMore}} more...
					</div>
				</div>

				<widget-dashboard-controls
					v-if="!props.meta.isOpenFull"
					:model-value="hasExpandedView && isControlsExpanded"
					:hide-controls="!hasExpandedView"
					:class="classes.controls"
					@update:model-value="(value) => isControlsExpanded = value"
				>
					<template #expanded>
						<ui-position
							v-if="slots['nav-menu']"
							placement="bottom-start"
						>
							<template #title>
								<button :class="classes.control">
									<ui-icon :id="IconIds.Burger" />
								</button>
							</template>
							<template #content>
								<slot name="nav-menu" />
							</template>
						</ui-position>

						<ui-position
							v-if="hasExpandedView"
							placement="bottom-start"
						>
							<template #title>
								<button :class="classes.control">
									<ui-icon :id="IconIds.SettingsV2" />
								</button>
							</template>
							<template #content>
								<template v-if="slots['settings-menu']">
									<slot name="settings-menu" />
								</template>

								<modal-badge-list v-else-if="slots['change-display']" display-variant="new">
									<slot name="change-display" />
								</modal-badge-list>
							</template>
						</ui-position>

						<button :class="classes.control" @click="handleFullscreen">
							<ui-icon
								:id="IconIds.ControlFullView"
								width="20px"
								height="20px"
							/>
						</button>
					</template>

					<template #minified>
						<ui-position
							ref="context-menu"
							placement="bottom-start"
						>
							<template #title>
								<button :class="classes.control">
									<ui-icon :id="IconIds.ThreeDots" />
								</button>
							</template>

							<template #content v-if="isWidgetActionsEnabled">
								<widget-context-menu
									:title="props.meta.name"
									:dashboards="props.meta.dashboards"
									display-variant="new"
									@delete="emits('delete')"
									@duplicate="emits('duplicate')"
									@move-to="emits('moveTo', $event)"
									@reset="emits('reset')"
									@open-full="handleFullscreen"
								>
									<template #change-display v-if="slots['change-display']">
										<slot name="change-display" />
									</template>
									<template #filter v-if="slots['filter']">
										<slot name="filter" />
									</template>
									<template #other v-if="slots['other']">
										<slot name="other" />
									</template>
								</widget-context-menu>
							</template>
						</ui-position>
					</template>
				</widget-dashboard-controls>
			</div>

			<div
				v-if="$slots.filters"
				:class="classes.filters"
			>
				<slot name="filters" />
			</div>
		</div>
		<div :class="classes.content">
			<slot name="content" />
		</div>

		<teleport to="body">
			<full-view-dashboard
				v-model="isFullscreen"
				:meta="props.meta"
				display-variant="dashboard"
			/>
		</teleport>
	</div>
</template>

<style module="classes">
.container {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	background: rgb(20 20 21 / 92%);
	border: 1px solid rgb(73 73 80 / 12%);
	border-radius: 12px;
}

.title {
	position: sticky;
	top: 0;
	z-index: 3;
	display: flex;
	flex-direction: column;
	backdrop-filter: blur(8px);
	background: rgb(20 20 21 / 92%);
	border-top-left-radius: 12px;
	border-top-right-radius: 12px;
}

.titleHeader {
	display: flex;
	align-items: center;
	height: 40px;
	padding: 0 10px;
}

.titleText {
	padding: 4px  10px;
	font-style: normal;
	font-weight: 450;
	font-size: 11.8px;
	line-height: 165%; /* 19.47px */
	color: #ffffff;
	letter-spacing: 0.059px;
}

.displayVariantContainer {
	display: flex;
}

.displayVariant {
	display: flex;
	align-items: center;
	padding: 0 10px 0 6px;
	color: rgb(255 255 255 / 60%);
	cursor: pointer;
	gap: 3px;
}

.displayVariant:hover {
	color: #ffffff;
}

.activeDisplayVariant {
	color: #ffffff;
}

.displayVariantText {
	overflow: hidden;
	font-style: normal;
	font-weight: 520;
	font-size: 11.8px;
	line-height: 165%; /* 19.47px */
	letter-spacing: 0.059px;
	text-overflow: ellipsis;
}

.controls {
	opacity: 0;
	transition: opacity 0.2s ease;
}

.titleHeader:hover .controls {
	opacity: 1;
}

.control {
	width: 24px;
	height: 24px;
	padding: 0;
	line-height: 0;
	color: var(--text-color-base-100);
	cursor: pointer;
}

.control:hover {
	color: var(--text-color-base-500, #ffffff);
}

.filters {
	padding: 6px 16px 6px 20px;
}

.content {
	display: flex;
	flex: 1;
	flex-direction: column;
	overflow-y: hidden;
}
</style>


