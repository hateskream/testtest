<script setup lang="ts">
import { WidgetType } from '@/modules/dashboard-group/core';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import type { IWidgetPreset } from '@/modules/dashboard-group/core';

import DraggableElement from './draggable-element.vue';
import DashboardComponent from './dashboard-component.vue';
import SearchComponent from './search-component.vue';

const WIDGET_TYPE_TO_ICON: Partial<Record<WidgetType, IconIds>> = {
	[WidgetType.Market]: IconIds.LogoWidgetMarket,
	[WidgetType.FearGreed]: IconIds.LogoWidgetFearAndGreat,
	[WidgetType.Price]: IconIds.LogoWidgetPrice,
	[WidgetType.News]: IconIds.LogoWidgetNews,
	[WidgetType.Watchlist]: IconIds.LogoWidgetWatchlist,
	[WidgetType.MarketCap]: IconIds.LogoWidgetMarketCap,
	[WidgetType.BitcoinDominanc]: IconIds.LogoWidgetMarketCap,
};

interface IDashboardsCurtainComponentProps {
	preset: IWidgetPreset[];
}

const props = defineProps<IDashboardsCurtainComponentProps>();

const isCurtainFixed = defineModel<boolean>('isCurtainFixed', { required: true });

const emit = defineEmits<{
	(e: 'drag'): void;
	(e: 'drag-end'): void;
	(e: 'new-dashboard', dashboard: IWidgetPreset | null): void;
}>();

function onDrag() {
	emit('drag');
}

function onDragStart(dashboard: IWidgetPreset) {
	emit('new-dashboard', dashboard);
}

function onDragEnd() {
	emit('drag-end');
}

function fixCurtain() {
	isCurtainFixed.value = true;
}
</script>

<template>
	<div :class="[classes.root, { [classes.notFixed]: !isCurtainFixed }]">
		<div :class="classes.container">
			<div :class="classes.content">
				<div :class="classes.header">
					Add widgets
				</div>
				<search-component :class="classes.search" />

				<div :class="classes.list">
					<draggable-element
						v-for="(widget, index) in props.preset"
						:key="index"
						@drag="onDrag"
						@drag-start="onDragStart(widget)"
						@drag-end="onDragEnd"
					>
						<template #content>
							<dashboard-component
								:title="widget.name"
								:description="widget.description"
								:icon="WIDGET_TYPE_TO_ICON[widget.widgetType]"
							/>
						</template>
						<template #ghost>
							<slot name="ghost" :title="widget.name" />
						</template>
					</draggable-element>
				</div>
			</div>
			<div v-if="!isCurtainFixed" :class="classes.panel">
				<div
					ref="curtainIconRef"
					:class="classes.iconWrapper"
					@click="fixCurtain"
				>
					<ui-icon
						:id="IconIds.ControlRightMenu"
						width="20px"
						height="20px"
					/>
				</div>

				<div
					ref="addWidgetIconRef"
					:class="classes.iconWrapper"
					@click="fixCurtain"
				>
					<ui-icon
						:id="IconIds.AddWidget"
						width="20px"
						height="20px"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.list {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.root {
	width: 358px;
	height: 100%;
}

.notFixed {
	background-color: var(--bg-modal-color-base);
	border: 1px solid var(--border-modal-color-base);
	border-radius: 18px;
}

.container {
	display: flex;
	height: 100%;
}

.content {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	padding: 18px 12px 0 8px;
	overflow-y: auto;
	scrollbar-width: none;
}

.header {
	position: sticky;
	top: 0;
	z-index: 1;
	padding-bottom: 12px;
	padding-left: 12px;
	font-style: normal;
	font-weight: 340;
	font-size: 15px;
	line-height: 100%;
	color: var(--text-color-base-500);
	letter-spacing: 0.075px;
	background-color: inherit;
}

.search {
	margin: 0 12px 16px;
}

.panel {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
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
</style>
