<script setup lang="ts">
import { ref } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';

import HeaderPanel from './header-panel.vue';
import PanelComponent from './panel-component.vue';

interface INavigationItem {
	icon: IconIds;
	id: IconIds;
}

const navigation: INavigationItem[] = [
	{
		icon: IconIds.Home,
		id: IconIds.Home,
	},
	{
		icon: IconIds.Chart,
		id: IconIds.Chart,
	},
	{
		icon: IconIds.Calendar,
		id: IconIds.Calendar,
	},
];

const activeItem = ref(IconIds.Home);

function setActiveItem(id: IconIds) {
	activeItem.value = id;
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
				<div
					v-for="item in navigation"
					:key="item.icon"
					:class="classes.iconWrapper"
					@click="setActiveItem(item.id)"
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
				</div>
			</nav>
		</panel-component>
		<div :class="classes.center">
			<header-panel :class="classes.header">
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
				/>
			</div>

			<div :class="classes.addWidget">
				<div :class="classes.iconWrapper">
					<ui-icon
						:id="IconIds.AddWidget"
						width="20px"
						height="20px"
					/>
				</div>
				<div :class="classes.addWidgetText">Add widgets</div>
			</div>
		</panel-component>
	</div>
</template>

<style module="classes">
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
