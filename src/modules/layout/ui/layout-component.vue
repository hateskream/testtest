<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { computed, reactive, useTemplateRef, watch } from 'vue';
import { useElementHover, useWindowSize } from '@vueuse/core';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { useMousePosition, usePanelWidth } from '../composables';
import { ReleaseNotes } from '@/modules/release-notes';
import { EnvironmentName, getEnvironmentName } from '@/shared/lib';
import { SidebarExpanded, SidebarMinified } from '@/modules/dashboard-sidebar';

import HeaderPanel from './header-panel.vue';
import PanelComponent from './panel-component.vue';

interface ILayoutState {
	isOpenCurtain: boolean;
	isCurtainFixed: boolean;
	isSidebarExpanded: boolean;
}

interface ILayoutComponentProps {
	isEditMode?: boolean;
	isCurtainForceFixed?: boolean;
}

const env = getEnvironmentName();
const props = withDefaults(defineProps<ILayoutComponentProps>(), {
	isEditMode: false,
	isCurtainForceFixed: false,
});

const isCurtainFixed = defineModel<boolean>('isCurtainFixed', { required: true });

const { width } = useWindowSize();

const layoutState = reactive<ILayoutState>({
	isOpenCurtain: false,
	isCurtainFixed: false,
	isSidebarExpanded: false,
});

const curtainRef = useTemplateRef<HTMLElement>('curtainRef');
const curtainGuardRef = useTemplateRef<HTMLElement>('curtainGuardRef');
const curtainIconRef = useTemplateRef<HTMLElement>('curtainIconRef');
const addWidgetIconRef = useTemplateRef<HTMLElement>('addWidgetIconRef');
const rightPanelRef = useTemplateRef('rightPanelRef');
const leftPanelRef = useTemplateRef('leftPanelRef');

const { pannelWidth } = usePanelWidth(leftPanelRef, rightPanelRef);
const { isMouseInElement } = useMousePosition(curtainGuardRef);

const isCurtainIconHovered = useElementHover(curtainIconRef);
const isAddWidgetIconHovered = useElementHover(addWidgetIconRef);
const isControlOpenCurtainHovered = computed(
	() => isCurtainIconHovered.value || isAddWidgetIconHovered.value,
);

const isLargeScreen = computed(() => width.value >= 2560);
const canChangeCurtainFix = computed(() => !isLargeScreen.value);

const centerContentStyle = computed((): Partial<CSSProperties> => ({
	marginLeft: `${pannelWidth.left}px`,
	marginRight: `${pannelWidth.right}px`,
}));

watch(isControlOpenCurtainHovered, (hovered) => {
	if (hovered) {
		openCurtain();
	}
});

watch(isMouseInElement, (inside) => {
	if (!inside) {
		closeCurtain();
	}
});

watch(
	isLargeScreen,
	(isLarge) => {
		if (isLarge) {
			isCurtainFixed.value = true;
			layoutState.isCurtainFixed = true;
			layoutState.isSidebarExpanded = true;
			layoutState.isOpenCurtain = false;
		} else {
			layoutState.isCurtainFixed = isCurtainFixed.value;
			layoutState.isSidebarExpanded = false;
		}
	},
	{ immediate: true },
);

watch(
	() => isCurtainFixed.value,
	(newValue) => {
		if (isLargeScreen.value) {
			isCurtainFixed.value = true;
			layoutState.isCurtainFixed = true;
			layoutState.isOpenCurtain = false;
			return;
		}

		layoutState.isCurtainFixed = newValue;
		if (newValue) {
			layoutState.isOpenCurtain = false;
		}
	},
);

function openCurtain() {
	if (layoutState.isCurtainFixed) {
		layoutState.isOpenCurtain = false;
		return;
	}
	layoutState.isOpenCurtain = true;
}

function closeCurtain() {
	if (!layoutState.isCurtainFixed) {
		layoutState.isOpenCurtain = false;
	}
}

function unFixCurtain() {
	if (props.isCurtainForceFixed) {
		return;
	}

	if (!canChangeCurtainFix.value) {
		return;
	}

	isCurtainFixed.value = false;
	layoutState.isCurtainFixed = false;
	layoutState.isOpenCurtain = false;
}

function expandSidebar() {
	layoutState.isSidebarExpanded = true;
}

function minifySidebar() {
	if (isLargeScreen.value) {
		return;
	}
	layoutState.isSidebarExpanded = false;
}
</script>

<template>
	<div :class="classes.root">
		<panel-component
			ref="leftPanelRef"
			:class="classes.leftPanel"
			varinat="left"
		>
			<sidebar-expanded
				v-if="layoutState.isSidebarExpanded"
				@minify="minifySidebar"
			/>
			<sidebar-minified
				v-else
				@expand="expandSidebar"
			/>
		</panel-component>
		<div :class="classes.center" :style="centerContentStyle">
			<header-panel v-if="$slots.header" :class="classes.header">
				<slot name="header" />
			</header-panel>
			<div :class="classes.content">
				<slot name="content" />
			</div>
		</div>
		<panel-component
			ref="rightPanelRef"
			:class="classes.rightPanel"
			varinat="right"
		>
			<template
				v-if="layoutState.isCurtainFixed"
			>
				<slot name="curtain" />
			</template>
			<div :class="classes.rightPanelControls">
				<div
					ref="curtainIconRef"
					:class="classes.iconWrapper"
					@click="unFixCurtain"
				>
					<ui-icon
						:id="IconIds.ControlRightMenu"
						width="20px"
						height="20px"
					/>
				</div>
				<div v-show="!props.isEditMode" :class="classes.addWidget">
					<div
						ref="addWidgetIconRef"
						:class="classes.iconWrapper"
						@click="unFixCurtain"
					>
						<ui-icon
							:id="IconIds.AddWidget"
							width="20px"
							height="20px"
						/>
					</div>
					<div :class="classes.addWidgetText">Add widgets</div>
				</div>
				<div v-show="props.isEditMode">
					<slot name="delete" />
				</div>
			</div>
		</panel-component>
		<div
			v-if="layoutState.isOpenCurtain"
			ref="curtainRef"
			:class="classes.curtainOpen"
		>
			<slot name="curtain" />
			<div ref="curtainGuardRef" :class="classes.curtainGuard" />
		</div>
	</div>
	<release-notes v-if="env !== EnvironmentName.PROD" />
</template>

<style module="classes">
.curtainOpen {
	position: fixed;
	top: 0;
	right: 0;
	z-index: 2;
	width: max-content;
	height: 100%;
	padding: 12px;
}

.curtainGuard {
	position: absolute;
	top: 0;
	right: 0;
	z-index: -1;
	width: calc(100% + 15px);
	height: 100%;
}

.root {
	position: relative;
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}

.center {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	margin-right: 72px;
	margin-left: 72px;
}

.header {
	position: sticky;
	top: 0;
	z-index: 1;
}

.content {
	display: flex;
	flex-grow: 1;
}

.iconWrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 48px;
	height: 48px;
	color: var(--icon-color-base-300);
	cursor: pointer;
	transition: all 0.2s ease-in-out;

	&:hover {
		color: var(--icon-color-base-500);
	}
}

.leftPanel > :first-child {
	margin-bottom: 12px;
}

.rightPanel {
	display: flex;
	background-color: var(--bg-color-surface-00);
}

.rightPanelControls {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.addWidget {
	display: flex;
	flex-direction: column;
	max-width: 48px;
	color: var(--text-color-base-300);
	cursor: pointer;
}

.addWidgetText {
	font-weight: 440;
	font-size: 12px;
	line-height: 170%;
	text-align: center;
	letter-spacing: 0.8%;
}

.activeLink .iconWrapper {
	color: var(--icon-color-base-500);
}
</style>
