<script setup lang="ts">
import { reactive, ref, useTemplateRef, watch, computed } from 'vue';
import { useElementHover } from '@vueuse/core';
import type { CSSProperties } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { RouteNames } from '@/types/route.d';
import { usePanelWidth, useMousePosition } from '../composables';
import { ReleaseNotes } from '@/modules/release-notes';
import { EnvironmentName, getEnvironmentName } from '@/shared/lib';

import HeaderPanel from './header-panel.vue';
import PanelComponent from './panel-component.vue';

interface INavigationItem {
	icon: IconIds;
	id: IconIds;
	routeName: string;
	routeParams?: Record<string, string | number>;
}

interface ILayoutState {
	isOpenCurtain: boolean;
	isCurtainFixed: boolean;
}

interface ILayoutComponentProps {
	isEditMode?: boolean;
}

const env = getEnvironmentName();

const props = withDefaults(defineProps<ILayoutComponentProps>(), {
	isEditMode: false,
});

const isCurtainFixed = defineModel<boolean>('isCurtainFixed', { required: true });

const navigation: INavigationItem[] = [
	{
		icon: IconIds.Home,
		id: IconIds.Home,
		routeName: RouteNames.Home,
	},
	{
		icon: IconIds.Chart,
		id: IconIds.Chart,
		routeName: RouteNames.TickerStock,
		routeParams: { id: 1 },
	},
	{
		icon: IconIds.Chart,
		id: IconIds.Chart,
		routeName: RouteNames.TickerCrypto,
		routeParams: { id: 1 },
	},
	{
		icon: IconIds.Chart,
		id: IconIds.Chart,
		routeName: RouteNames.TickerIndices,
		routeParams: { id: 1 },
	},
	{
		icon: IconIds.Chart,
		id: IconIds.Chart,
		routeName: RouteNames.TickerForex,
		routeParams: { id: 1 },
	},
	{
		icon: IconIds.Chart,
		id: IconIds.Chart,
		routeName: RouteNames.TickerCommodities,
		routeParams: { id: 1 },
	},
	{
		icon: IconIds.Chart,
		id: IconIds.Chart,
		routeName: RouteNames.TickerETF,
		routeParams: { id: 1 },
	},
	{
		icon: IconIds.Heatmap,
		id: IconIds.Heatmap,
		routeName: RouteNames.Heatmap,
	},
];

const layoutState = reactive<ILayoutState>({
	isOpenCurtain: false,
	isCurtainFixed: isCurtainFixed.value,
});

const activeItem = ref(IconIds.Home);

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

const isControlOpenCurtainHovered = computed(() => isCurtainIconHovered.value || isAddWidgetIconHovered.value);

const centerContentStyle = computed((): Partial<CSSProperties> => {
	return {
		marginLeft: `${pannelWidth.left}px`,
		marginRight: `${pannelWidth.right}px`,
	};
});

const createRouteObject = (item: INavigationItem) => {
	return item.routeParams
		? { name: item.routeName, params: item.routeParams }
		: { name: item.routeName };
};

watch(isControlOpenCurtainHovered, newValue => {
	if (newValue) {
		openCurtain();
	}
});

watch(() => isCurtainFixed.value, newValue => {
	layoutState.isCurtainFixed = newValue;
});

watch(
	() => layoutState.isCurtainFixed,
	() => {
		closeCurtain();
	},
);

watch(isMouseInElement, newValue => {
	if (!newValue) {
		closeCurtain();
	}
});

function openCurtain() {
	if (layoutState.isCurtainFixed) {
		return;
	}

	layoutState.isOpenCurtain = true;
}

function closeCurtain() {
	layoutState.isOpenCurtain = false;
}

function unFixCurtain() {
	isCurtainFixed.value = false;
}
</script>

<template>
	<div :class="classes.root">
		<panel-component
			ref="leftPanelRef"
			:class="classes.leftPanel"
			varinat="left"
		>
			<div :class="classes.iconWrapper">
				<ui-icon
					:id="IconIds.Logo"
					width="40px"
					height="12px"
				/>
			</div>
			<nav>
				<router-link
					v-for="item in navigation"
					:key="`${item.routeName}-${item.id}`"
					:to="createRouteObject(item)"
					:class="classes.iconWrapper"
					:active-class="classes.activeLink"
				>
					<ui-icon
						:id="item.icon"
						:class="[
							classes.iconWrapper,
							{ [classes.iconNotActive]: item.id !== activeItem },
						]"
						width="20px"
						height="20px"
					/>
				</router-link>
			</nav>
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
			<div
				v-if="layoutState.isCurtainFixed"
				:class="classes.curtainFixed"
			>
				<slot name="curtain" />
			</div>
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
