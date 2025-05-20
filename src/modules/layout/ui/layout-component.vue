<script setup lang="ts">
import { reactive, ref, useTemplateRef, watch, computed, onBeforeUnmount, onMounted } from 'vue';
import { onClickOutside, useElementHover } from '@vueuse/core';
import type { CSSProperties } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { RouteNames } from '@/app/routes.ts';

import HeaderPanel from './header-panel.vue';
import PanelComponent from './panel-component.vue';

interface INavigationItem {
	icon: IconIds;
	id: IconIds;
	routeName: string;
}

interface ILayoutState {
	isOpenCurtain: boolean;
	isCurtainFixed: boolean;
	leftPanelWidth: number;
	rightPanelWidth: number;
}

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
		routeName: RouteNames.Chart,
	},
	{
		icon: IconIds.Calendar,
		id: IconIds.Calendar,
		routeName: RouteNames.Home,
	},
];

const disconectObserverFunc: (() => void)[] = [];

const layoutState = reactive<ILayoutState>({
	isOpenCurtain: false,
	isCurtainFixed: isCurtainFixed.value,
	leftPanelWidth: 72,
	rightPanelWidth: 72,
});

const activeItem = ref(IconIds.Home);

const curtainRef = useTemplateRef<HTMLElement>('curtainRef');
const curtainIconRef = useTemplateRef<HTMLElement>('curtainIconRef');
const addWidgetIconRef = useTemplateRef<HTMLElement>('addWidgetIconRef');
const rightPanelRef = useTemplateRef('rightPanelRef');
const leftPanelRef = useTemplateRef('leftPanelRef');

onClickOutside(curtainRef, closeCurtain);

const isCurtainIconHovered = useElementHover(curtainIconRef);
const isAddWidgetIconHovered = useElementHover(addWidgetIconRef);

const isControlOpenCurtainHovered = computed(() => isCurtainIconHovered.value || isAddWidgetIconHovered.value);

const centerContentStyle = computed((): Partial<CSSProperties> => {
	return {
		marginLeft: `${layoutState.leftPanelWidth}px`,
		marginRight: `${layoutState.rightPanelWidth}px`,
	};
});

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


onMounted(() => {
	const leftElement = leftPanelRef.value?.$el as HTMLElement | null;
	const rightElement = rightPanelRef.value?.$el as HTMLElement | null;

	startObserve(leftElement, width => {
		layoutState.leftPanelWidth = width;
	});

	startObserve(rightElement, width => {
		layoutState.rightPanelWidth = width;
	});
});

onBeforeUnmount(() => {
	disconectObserverFunc.forEach(disconect => disconect());
});

function createResizeObserver(element: HTMLElement, setterCallback: (width: number) => void) {
	const observer = new ResizeObserver(() => {
		setterCallback(element.clientWidth);
	});

	observer.observe(element);
	return observer.disconnect;
}

function startObserve(element: HTMLElement | null, setterCallback: (width: number) => void) {
	if (!element) {
		return;
	}

	const disconect = createResizeObserver(element, setterCallback);
	disconectObserverFunc.push(disconect);
}

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
					:key="item.icon"
					:to="{name:item.routeName}"
					:class="classes.iconWrapper"
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

				<div :class="classes.addWidget">
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
			</div>

		</panel-component>
		<div
			v-if="layoutState.isOpenCurtain"
			ref="curtainRef"
			:class="classes.curtainOpen"
		>
			<slot name="curtain" />
		</div>
	</div>
</template>

<style module="classes">
.curtainOpen {
	position: fixed;
	top: 0;
	right: 0;
	z-index: 1;
	width: max-content;
	height: 100%;
	padding: 12px;
}

.curtainFixed {
	/* d  */
}

.root {
	position: relative;
	display: flex;
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
	color: var(--icon-color-base-500);
	cursor: pointer;
}

.leftPanel > :first-child {
	margin-bottom: 12px;
}

.iconNotActive {
	color: var(--icon-color-base-300);
}

.rightPanel {
	display: flex;
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
	cursor: pointer;
}

.addWidgetText {
	font-weight: 440;
	font-size: 12px;
	line-height: 170%;
	text-align: center;
	color: var(--text-color-base-300);
	letter-spacing: 0.8;
}
</style>
