<script setup lang="ts">
import type { ITickerWidgetMeta } from '@/modules/ticker';
import { UiTag } from '@/shared/ui/tag';
import { BaseTickerWidgetContent, BaseTickerWidgetHeader, BaseTickerWidgetWrapper } from '@/modules/widgets/base';
import { useQueryAnnualReturns } from '../../queries';

import TickerAnnualReturnsWidgetLoader from './ticker-annual-returns-widget-loader.vue';
import TickerAnnualReturnsWidgetError from './ticker-annual-returns-widget-error.vue';
import AnnualReturnsChartLine from '../annual-returns-chart-line.vue';
import AnnualReturnsChartLabel from '../annual-returns-chart-label.vue';

const props = defineProps<{
	meta: ITickerWidgetMeta;
}>();

const { data, isLoading, isError, refetch } = useQueryAnnualReturns(
	() => props.meta.tickerId,
);
</script>

<template>
	<ticker-annual-returns-widget-loader
		v-if="isLoading"
		:meta="props.meta"
	/>

	<ticker-annual-returns-widget-error
		v-else-if="isError || !data"
		:meta="props.meta"
		@retry="refetch"
	/>

	<base-ticker-widget-wrapper
		v-else
		:class="classes.wrapper"
	>
		<base-ticker-widget-header :class="classes.header">
			<template #default>{{ props.meta.name }}</template>
			<template #right>
				<ui-tag :color="data.status">
					{{data.summary}}
				</ui-tag>
			</template>
		</base-ticker-widget-header>

		<base-ticker-widget-content :class="classes.content">
			<div
				v-for="(item, index) in data.items"
				:key="index"
				:class="[classes.item, classes[item.status]]"
			>
				<annual-returns-chart-label
					:item="item"
				/>
				<annual-returns-chart-line
					:item="item"
				/>
			</div>
		</base-ticker-widget-content>
	</base-ticker-widget-wrapper>
</template>

<style module="classes">
.wrapper {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	min-width: 200px;
	height: 329px;
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
	padding: var(--padding-padding-s11, 20px);
	gap: var(--padding-padding-s11, 20px);
}

.item {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: var(--padding-padding-s3, 4px);
	align-self: stretch;
	color: var(--text-300, rgb(255 255 255 / 62%));
	transition: color 0.25s ease;
}

.item.negative,
.item.positive,
.item:hover {
	color: var(--text-500, rgb(255 255 255 / 96%));
}
</style>
