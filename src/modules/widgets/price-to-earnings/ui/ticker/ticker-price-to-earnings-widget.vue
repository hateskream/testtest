<script setup lang="ts">
import { ref, watch, useTemplateRef, onBeforeUnmount } from 'vue';

import type { ITickerWidgetMeta } from '@/modules/ticker';
import { UiTag } from '@/shared/ui/tag';
import { BaseTickerWidgetContent, BaseTickerWidgetHeader, BaseTickerWidgetWrapper } from '@/modules/widgets/base';
import { useQueryPriceToEarnings } from '../../queries';
import { UiText } from '@/shared/ui/text';
import { UiWidgetLabel } from '@/shared/ui/widget-label';

import TickerPriceToEarningsWidgetLoader from './ticker-price-to-earnings-widget-loader.vue';
import TickerPriceToEarningsWidgetError from './ticker-price-to-earnings-widget-error.vue';
import PriceToEarningsChartTicks from '../price-to-earnings-chart-ticks.vue';

const props = defineProps<{
	meta: ITickerWidgetMeta;
}>();

const { data, isLoading, isError, refetch } = useQueryPriceToEarnings(
	() => props.meta.tickerId,
);

const contentRef = useTemplateRef('content');
const ticksWidth = ref(0);

const NAME_WIDTH = 43;
const VALUE_WIDTH = 43;

function updateTicksWidth() {
	if (!contentRef.value) {
		return;
	}

	const el = contentRef.value.$el as HTMLElement;
	const style = getComputedStyle(el);
	const innerWidth = el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);

	ticksWidth.value = innerWidth - NAME_WIDTH - VALUE_WIDTH;
}

let resizeObserver: ResizeObserver | null = null;

watch(contentRef, (comp, _, onCleanup) => {
	resizeObserver?.disconnect();
	const el = comp?.$el;

	if (!el) {
		return;
	}

	updateTicksWidth();

	resizeObserver = new ResizeObserver(() => {
		updateTicksWidth();
	});
	resizeObserver.observe(el);

	onCleanup(() => {
		resizeObserver?.disconnect();
	});
}, { flush: 'post' });

onBeforeUnmount(() => {
	resizeObserver?.disconnect();
});
</script>

<template>
	<ticker-price-to-earnings-widget-loader
		v-if="isLoading"
		:meta="props.meta"
	/>

	<ticker-price-to-earnings-widget-error
		v-else-if="isError || !data"
		:meta="props.meta"
		@retry="refetch"
	/>

	<base-ticker-widget-wrapper
		v-else
		:class="classes.wrapper"
	>
		<base-ticker-widget-header :class="classes.header">
			<template #label>
				<ui-widget-label>
					{{ props.meta.name }}
				</ui-widget-label>

				<ui-tag :color="data.status">
					{{ data.summary }}
				</ui-tag>
			</template>
		</base-ticker-widget-header>

		<base-ticker-widget-content ref="content" :class="classes.content">
			<div
				v-for="(item, index) in data.items"
				:key="index"
				:class="classes.item"
			>
				<ui-text token="text-200-r" :class="classes.name">
					{{ item.label }}
				</ui-text>
				<price-to-earnings-chart-ticks :item="item" :width="ticksWidth" />
				<ui-text token="text-200-r" :class="classes.value">
					{{ item.value }}
				</ui-text>
			</div>
		</base-ticker-widget-content>
	</base-ticker-widget-wrapper>
</template>

<style module="classes">
.wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 17px;
	align-self: stretch;
	min-height: 241px;
}

.header {
	display: flex;
	justify-content: space-between;
}

.content {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	align-self: stretch;
	padding:
		var(--padding-padding-s20, 72px) var(--padding-padding-s11, 20px)
		var(--padding-padding-s11, 20px) var(--padding-padding-s11, 20px);
	gap: var(--padding-padding-s11, 20px);
}

.item {
	display: flex;
	align-items: center;
	align-self: stretch;
	color: var(--text-300, rgb(255 255 255 / 62%));
	transition: color 0.25s;
}

.item:hover {
	color: var(--text-500, rgb(255 255 255 / 96%));
}

.name {
	align-self: stretch;
	width: 43px;
	text-align: left;
}

.value {
	align-self: stretch;
	width: 43px;
	text-align: right;
}
</style>
