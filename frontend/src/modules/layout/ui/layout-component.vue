<script setup lang="ts">
import { reactive, ref, useTemplateRef } from 'vue';
import { onClickOutside } from '@vueuse/core';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { RouteNames } from '@/app/routes.ts';

import HeaderPanel from './header-panel.vue';
import PanelComponent from './panel-component.vue';

interface INavigationItem {
	icon: IconIds;
	id: IconIds;
	routeName: string;
}

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

const layoutState = reactive({
	isOpenCurtain: false,
	isCurtainFixed: false,
});

const activeItem = ref(IconIds.Home);

const curtainRef = useTemplateRef<HTMLElement>('curtainRef');

onClickOutside(curtainRef, closeCurtain);

function openCurtain() {
	layoutState.isOpenCurtain = true;
}

function closeCurtain() {
	layoutState.isOpenCurtain = false;
}
</script>

<template>
	<div :class="classes.root">
		<panel-component
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
		<div :class="classes.center">
			<header-panel v-if="$slots.header" :class="classes.header">
				<slot name="header" />
			</header-panel>
			<div :class="classes.content">
				<slot name="content" />
			</div>
		</div>
		<panel-component
			:class="classes.rightPanel"
			varinat="right"
		>
			<div :class="classes.iconWrapper">
				<ui-icon
					:id="IconIds.ControlRightMenu"
					width="20px"
					height="20px"
					@click="openCurtain"
				/>
			</div>

			<div :class="classes.addWidget">
				<div :class="classes.iconWrapper">
					<ui-icon
						:id="IconIds.AddWidget"
						width="20px"
						height="20px"
						@click="openCurtain"
					/>
				</div>
				<div :class="classes.addWidgetText">Add widgets</div>
			</div>
		</panel-component>
		<div
			v-if="layoutState.isOpenCurtain"
			ref="curtainRef"
			:class="classes.curtain"
		>
			<div :class="classes.curtainContainer">
				<slot name="curtain" />
			</div>
		</div>
	</div>
</template>

<style module="classes">
.curtainContainer {
	width: max-content;
	height: 100%;
	padding: 18px;
	background-color: #000000;
	border: 1px solid var(--border-modal-color-base);
	border-radius: 18px;
}

.curtain {
	position: fixed;
	top: 0;
	right: 0;
	z-index: 1;
	width: max-content;
	height: 100%;
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
	flex-direction: column;
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
	flex-direction: column;
	justify-content: space-between;
}

.addWidget {
	display: flex;
	flex-direction: column;
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
