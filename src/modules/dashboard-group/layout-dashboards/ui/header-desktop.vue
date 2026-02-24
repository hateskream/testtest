<script setup lang="ts">
import { computed } from 'vue';

import type { IDashboardTab } from '../model';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiText } from '@/shared/ui/text';
import { ComingSoonTooltip } from '@/modules/layout/new-desktop';
import { UiPositionTooltip } from '@/shared/ui/position';

import HeaderDesktopSettings from './header-desktop-settings.vue';

interface IHeaderDesktop {
	tabs: IDashboardTab[];
}

const props = defineProps<IHeaderDesktop>();

const emits = defineEmits<{
	changeActive: [id: string];
}>();

const active = computed(() => props.tabs.find(el => el.isActive));
</script>

<template>
	<div :class="classes.navbar">
		<div :class="classes.left">
			<ui-text token="text-300-b" as="div">Dashboard</ui-text>
			<ui-position-tooltip trigger="click" placement="bottom-start">
				<template #default>
					<ui-icon
						:id="IconIds.ControlMore"
						:class="classes.iconWrapper"
						width="20px"
						height="20px"
					/>
				</template>
				<template #content>
					<header-desktop-settings />
				</template>
			</ui-position-tooltip>
			<div :class="classes.tabs">
				<template
					v-for="tab in props.tabs"
					:key="tab.id"
				>
					<coming-soon-tooltip
						v-if="tab.isComingSoon"
						:title="tab.name"
						:text="tab.comingSoonText!"
					>
						<button
							:class="[classes.tab, active === tab && classes.active]"
						>
							<ui-text token="text-300-b">{{ tab.name }}</ui-text>
						</button>
					</coming-soon-tooltip>
					<button
						v-else
						:class="[classes.tab, active === tab && classes.active]"
						@click="emits('changeActive', tab.id)"
					>
						<ui-text token="text-300-b">{{ tab.name }}</ui-text>
					</button>
				</template>
			</div>
		</div>

		<div :class="classes.right">
			<coming-soon-tooltip title="Add widgets" text="Customize your dashboard with new tools — coming soon.">
				<div :class="classes.add">
					<ui-icon
						:id="IconIds.Plus"
						width="16px"
						height="16px"
					/>
					<ui-text token="text-300-r">Add</ui-text>
					<ui-icon
						:id="IconIds.DropdownDown"
						width="12"
						height="12"
					/>
				</div>
			</coming-soon-tooltip>
			<div :class="classes.divider" />
			<ui-icon
				:id="IconIds.ControlRightMenu"
				width="20px"
				height="20px"
				:class="classes.controlRightMenu"
			/>
		</div>
	</div>
</template>

<style module="classes">
.navbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 44px;
	padding: 0 18px 0 16px;
	color: #ffffff;
}

.left {
	display: flex;
	align-items: center;
	gap: 6px;
}

.right {
	display: flex;
	align-items: center;
	gap: 8px;
}

.iconWrapper {
	color: rgb(255 255 255 / 60%);
	cursor: pointer;
	transition: color 0.2s ease-in-out;
}

.iconWrapper:hover {
	color: var(--text-500, rgb(255 255 255 / 96%));
}

.tabs {
	display: flex;
	align-items: center;
	padding-left: 6px;
	overflow: hidden;
	text-overflow: ellipsis;
	gap: 16px;
}

.tab {
	padding: 0;
	color: rgb(255 255 255 / 60%);
	cursor: pointer;
	transition: background 0.2s, color 0.2s;
}

.tab:hover {
	color: #ffffff;
}

.active {
	color: rgb(255 255 255 / 96%);
}

.add {
	display: flex;
	align-items: center;
	height: 30px;
	padding: 0 10px;
	overflow: hidden;
	color: rgb(255 255 255 / 50%);
	text-overflow: ellipsis;
	background: rgb(73 73 80 / 32%);
	border-radius: 12px;
	cursor: pointer;
	gap: 4px;
}

.add:hover {
	color: #ffffff;
	background: rgb(73 73 80 / 50%);
}

.divider {
	width: 1px;
	height: 15px;
	margin: 0 6px;
	background: rgb(73 73 80 / 52%);
}

.controlRightMenu {
	color: rgb(255 255 255 / 50%);
	transform: rotate(270deg);
	cursor: pointer;
}

.controlRightMenu:hover {
	color: #ffffff;
}
</style>
