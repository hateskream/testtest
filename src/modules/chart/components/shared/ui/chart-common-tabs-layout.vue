<script setup lang="ts">
import { UiText } from '@/shared/ui/text';

interface ITabItem {
	id: string;
	title: string;
}

interface IProps {
	activeTab?: string;
	tabList: ITabItem[];
	setActiveTab: (id: string) => void;
}

defineProps<IProps>();
</script>

<template>
	<div :class="classes.tabsLayout">
		<!-- Tab Headers -->
		<div :class="classes.tabHeaders">
			<div
				v-for="tab in tabList"
				:key="tab.id"
				:class="[
					classes.tabHeader,
					{
						[classes.active]: activeTab === tab.id,
						[classes.inactive]: activeTab !== tab.id
					}
				]"
				@click="setActiveTab(tab.id)"
			>
				<slot
					:name="`${tab.id}-header`"
					:tab="tab"
					:is-active="activeTab === tab.id"
				>
					<ui-text token="text-200-r">
						{{ tab.title }}
					</ui-text>
				</slot>
			</div>
		</div>

		<!-- Tab Content -->
		<div :class="classes.tabContent">
			<div
				v-for="tab in tabList"
				v-show="activeTab === tab.id"
				:key="`${tab.id}-content`"
				:class="[
					classes.tabPanel,
					{
						[classes.active]: activeTab === tab.id,
						[classes.inactive]: activeTab !== tab.id
					}
				]"
			>
				<slot
					:name="tab.id"
					:tab="tab"
					:is-active="activeTab === tab.id"
				/>
			</div>
			<div v-if="$slots.common" :class="classes.separator">

			</div>
			<slot name="common">
			</slot>
		</div>
	</div>
</template>

<style module="classes">
.tabsLayout {
	width: 100%;
}

.tabHeaders {
	display: flex;
	width: fit-content;
	text-wrap: nowrap;
	border-radius: 18px;
}

.tabHeader {
	position: relative;
	display: flex;
	flex: 1;
	align-items: center;
	height: 40px;
	padding: var(--padding-padding-s5, 8px) var(--padding-padding-s8, 14px);
	text-align: center;
	color: var(--text-color-base-500);
	border-top: 1px solid transparent;
	border-right: 1px solid transparent;
	border-left: 1px solid transparent;
	border-radius: var(--radius-radius-s14-32, 12.4px) var(--radius-radius-s14-32, 12.4px) 0 0;
	cursor: pointer;
}

.tabHeader.active {
	background: var(--surface-01, rgb(17 17 19 / 92%));
	border-top: 1px solid var(--atom-base-90, rgb(73 73 80 / 15%));
	border-right: 1px solid var(--atom-base-90, rgb(73 73 80 / 15%));
	border-left: 1px solid var(--atom-base-90, rgb(73 73 80 / 15%));
	border-radius: var(--radius-radius-s14-32, 12.4px) var(--radius-radius-s14-32, 12.4px) 0 0;
}

.tabContent {
	display: flex;
	flex-direction: column;
	border-radius: 0 18px 18px;
	gap: 8px;
}

.separator {
	height: 1px;
	margin: 0 8px;
	background: var(--border-color-surface-02-effect);
}

.tabPanel.active {
	display: block;
}

.tabPanel.inactive {
	display: none;
}
</style>
