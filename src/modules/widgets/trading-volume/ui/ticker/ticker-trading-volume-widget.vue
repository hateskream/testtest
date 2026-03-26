<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue';

import type { ITickerWidgetMeta } from '@/modules/ticker';
import { BaseTickerWidgetWrapper, BaseTickerWidgetHeader, BaseTickerWidgetContent } from '@/modules/widgets/base';
import { UiTag } from '@/shared/ui/tag';
import { useQueryTradingVolume } from '../../query';

import TradingVolumeLabel from '../trading-volume-label.vue';
import TradingVolumeTicks from '../trading-volume-ticks.vue';
import TickerTradingVolumeWidgetLoader from './ticker-trading-volume-widget-loader.vue';
import TickerTradingVolumeWidgetError from './ticker-trading-volume-widget-error.vue';

const props = defineProps<{
	meta: ITickerWidgetMeta;
}>();

const { data, isLoading, isError, refetch } = useQueryTradingVolume(() => props.meta.tickerId);

const contentRef = useTemplateRef('content');
const ticksWidth = ref(0);

function updateTicksWidth() {
	if (!contentRef.value) {
		return;
	}

	const el = contentRef.value.$el as HTMLElement;
	const style = getComputedStyle(el);

	ticksWidth.value = el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
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

const maxChange = computed((): number => data.value?.max_change ?? 1);
</script>

<template>
	<ticker-trading-volume-widget-loader
		v-if="isLoading"
		:meta="props.meta"
	/>

	<ticker-trading-volume-widget-error
		v-else-if="isError || !data"
		:meta="props.meta"
		@retry="refetch"
	/>

	<base-ticker-widget-wrapper v-else :class="classes.wrapper">
		<base-ticker-widget-header>
			{{props.meta.name}}

			<template #right>
				<ui-tag :color="data.sentiment.status">
					{{ data.sentiment.label }}
				</ui-tag>
			</template>
		</base-ticker-widget-header>

		<base-ticker-widget-content ref="content" :class="classes.content">
			<div
				v-for="period in data.periods"
				:key="period.period"
				:class="classes.item"
			>
				<trading-volume-label
					:period="period.period"
					:change="period.change"
					:status="period.status"
				/>
				<trading-volume-ticks
					:width="ticksWidth"
					:ratio="Math.abs(period.change) / maxChange"
					:status="period.status"
				/>
			</div>
		</base-ticker-widget-content>
	</base-ticker-widget-wrapper>
</template>

<style module="classes">
.wrapper {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
	height: 345px;
}

.content {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	align-self: stretch;
	padding: var(--padding-padding-s11, 20px);
	gap: var(--padding-padding-s11, 20px);
}

.item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6px;
	align-self: stretch;
}
</style>
