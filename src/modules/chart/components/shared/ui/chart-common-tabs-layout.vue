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
					{{ tab.title }}
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

<script setup lang="ts">
interface ITabItem {
	id: string;
	title: string;
}

interface IProps {
	activeTab: string;
	tabList: ITabItem[];
	setActiveTab: (id: string) => void;
}

defineProps<IProps>();
</script>

<style module="classes">
.tabsLayout {
	width: 100%;
}

.tabHeaders {
	display: flex;
	width: fit-content;
	text-wrap: nowrap;
	border-radius: 12px;
}

.tabHeader {
	position: relative;
	flex: 1;
	padding: 12px 16px 8px;
	text-align: center;
	background:
		linear-gradient(0deg, #050505, #050505),
		linear-gradient(64.97deg, #000000 3.91%, #0c0c0d 97.73%);
	border: none;
	border-radius: 8px 8px 0 0;
	cursor: pointer;
	transition: all 0.2s ease;
}

.tabHeader.active {
	color: var(--text-color-base-500);
	background: var(--bg-color-surface-01);
}

.tabHeader.inactive {
	color: #6b7280;
	background: transparent;
}

.tabHeader.inactive:hover {
	color: #9ca3af;
	background: rgb(255 255 255 / 5%);
}

.tabContent {
	background: #131315;
	border-radius: 0 18px 18px;
	display:flex;
	flex-direction: column;
	gap:8px;
}
.separator {
	height: 1px;
	background: var(--border-color-surface-02-effect);
	margin:  0 8px;
}

.tabPanel.active {
	display: block;
	animation: fade-in 0.3s ease-in-out;
}

.tabPanel.inactive {
	display: none;
}

@keyframes fade-in {
	from {
		opacity: 0;
	}

	to {
		opacity: 1;
	}
}
</style>
