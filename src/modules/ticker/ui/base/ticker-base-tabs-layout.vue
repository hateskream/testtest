<script setup lang="ts">
import { type Component, computed } from 'vue';

import { UiText } from '@/shared/ui/text';

interface IBaseTabItem {
	id: string | number;
	title: string;
	component: Component;
}

const props = defineProps<{
	tabs: readonly IBaseTabItem[];
}>();

const selectedTabId = defineModel<string | number>({
	required: true,
});

const activeComponent = computed(() =>
	props.tabs.find(tab => tab.id === selectedTabId.value)?.component ?? props.tabs[0].component,
);
</script>

<template>
	<div :class="classes.layout">
		<div :class="classes.tabs">
			<button
				v-for="tab in props.tabs"
				:key="tab.id"
				:class="classes.tab"
				:aria-selected="selectedTabId === tab.id"
				@click="selectedTabId = tab.id"
			>
				<ui-text token="text-200-r">
					{{ tab.title }}
				</ui-text>
			</button>
		</div>

		<div :class="classes.content">
			<div :class="classes.list">
				<keep-alive>
					<component :is="activeComponent" />
				</keep-alive>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.layout {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: -1px;
	align-self: stretch;
}

.tabs {
	display: flex;
	align-items: center;
	gap: var(--padding-padding-s1, 1px);
}

.tab {
	display: flex;
	align-items: center;
	height: 40px;
	padding: var(--padding-padding-s5, 8px) var(--padding-padding-s8, 14px);
	color: var(--text-500, rgb(255 255 255 / 96%));
	border-top: 1px solid transparent;
	border-right: 1px solid transparent;
	border-left: 1px solid transparent;
	border-radius: var(--radius-radius-s14-32, 12.4px) var(--radius-radius-s14-32, 12.4px) 0 0;
	cursor: pointer;
}

.tab[aria-selected='true'] {
	background: var(--surface-01, rgb(17 17 19 / 92%));
	border-top: 1px solid var(--atom-base-90, rgb(73 73 80 / 15%));
	border-right: 1px solid var(--atom-base-90, rgb(73 73 80 / 15%));
	border-left: 1px solid var(--atom-base-90, rgb(73 73 80 / 15%));
	border-radius: var(--radius-radius-s14-32, 12.4px) var(--radius-radius-s14-32, 12.4px) 0 0;
}

.content {
	display: flex;
	align-items: center;
	align-self: stretch;
	background: var(--surface-01, rgb(17 17 19 / 92%));
	border: 1px solid var(--atom-base-90, rgb(73 73 80 / 15%));
	border-radius:
		var(--radius-radius-s0, 0) var(--radius-radius-s14-32, 12.4px)
		var(--radius-radius-s14-32, 12.4px) var(--radius-radius-s14-32, 12.4px);
}

.list {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	align-items: flex-start;
	gap: var(--padding-padding-s5, 8px);
	min-width: 0;
}
</style>
