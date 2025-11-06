<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { RoutePaths } from '@/types/route.d';

import MenuItem from './menu-item.vue';
</script>

<template>
	<div :class="classes.root">
		<div :class="[classes.panel, classes.leftPanel]">
			<div :class="classes.iconContainer">
				<div :class="classes.logo">
					<ui-icon
						:id="IconIds.LogoWithoutText"
						width="22px"
						height="18px"
					/>
				</div>
				<menu-item
					:icon="IconIds.Cashflow"
					:is-active="false"
					text="Cashflow"
					link="/"
				/>
				<menu-item
					:icon="IconIds.Arbitrage"
					:is-active="false"
					text="Arbitrage"
					link="/"
				/>
				<div :class="classes.line" />
			</div>
			<div :class="classes.iconContainer">
				<menu-item
					:icon="IconIds.Board"
					is-active
					text="Board"
					link="/"
				/>
				<menu-item
					:icon="IconIds.Screen"
					:is-active="false"
					text="Screen"
					link="/"
				/>
				<menu-item
					:icon="IconIds.Heat"
					:is-active="false"
					text="Heat"
					:link="RoutePaths.Heatmap"
				/>
				<menu-item
					:icon="IconIds.Cal"
					:is-active="false"
					text="Cal"
					:link="RoutePaths.Calendar"
				/>
				<menu-item
					:icon="IconIds.News"
					:is-active="false"
					text="News"
					:link="RoutePaths.News"
				/>
				<menu-item
					:icon="IconIds.TV"
					:is-active="false"
					text="TV"
					:link="RoutePaths.Tv"
				/>
			</div>
			<div :class="classes.bottom">
				<menu-item
					:icon="IconIds.SetUp"
					:is-active="false"
					text="Set Up"
					link="/"
				/>
			</div>
		</div>
		<div :class="classes.center">
			<slot />
		</div>
		<div :class="[classes.panel, classes.rightPanel]">
			<div :class="classes.iconContainer">
				<menu-item
					:icon="IconIds.Search"
					:is-active="false"
					text="Search"
					link="/"
				/>
				<menu-item
					:icon="IconIds.AskAI"
					:is-active="false"
					text="Ask AI"
					link="/"
				/>
				<menu-item
					:icon="IconIds.Watch"
					:is-active="false"
					text="Watch"
					link="/"
				/>
			</div>
			<div :class="[classes.iconContainer, classes.bottom]">
				<menu-item
					:icon="IconIds.Help"
					:is-active="false"
					text="Help"
					link="/"
				/>
				<menu-item
					:icon="IconIds.Tray"
					:is-active="false"
					text="Tray"
					link="/"
				/>
			</div>
		</div>
	</div>
</template>

<style module="classes">
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
	margin-right: 52px;
	margin-left: 52px;
}

.panel {
	position: fixed;
	top: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 52px;
	height: 100vh;
	padding: 12px 8px;
}

.iconContainer {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
}

.line {
	width: 16px;
	height: 1px;
	margin-bottom: 8px;
	background: rgb(255 255 255 / 18%);
}

.logo {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 44px;
	height: 44px;
	color: #ffffff;
}

.bottom {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	justify-content: flex-end;
	align-items: center;
	gap: 8px;
}

.rightPanel {
	right: 0;
}

.leftPanel {
	left: 0;
}
</style>
