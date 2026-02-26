<script setup lang="ts">
import { computed } from 'vue';

import { BaseTickerWidgetContent, BaseTickerWidgetHeader, BaseTickerWidgetWrapper } from '@/modules/widgets/base';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiText } from '@/shared/ui/text';
import type { IUSInflationDomain } from '../../model';
import type { ITickerWidgetMeta } from '@/modules/ticker';

import ChartComponent from '../common/chart-component.vue';

interface IProps {
	data: IUSInflationDomain;
	meta: ITickerWidgetMeta;
}

const props = defineProps<IProps>();

const isUpTrend = computed(() => props.data.yoy_change.direction === 'up');

const trendLabel = computed(() => {
	return isUpTrend.value ? 'growth' : 'down';
});
</script>

<template>
	<base-ticker-widget-wrapper>
		<base-ticker-widget-header>
			{{ props.meta.name }}
		</base-ticker-widget-header>
		<base-ticker-widget-content>
			<div :class="classes.wrapper">
				<div :class="classes.container">
					<div :class="classes.textContainer">
						<div :class="classes.title">
							<ui-text token="title-200">{{ props.data.current_value }}%</ui-text>
						</div>
						<div :class="classes.text">
							<ui-text token="text-200-r">
								Inflation {{ trendLabel }} YoY:
							</ui-text>
						</div>
						<div :class="[classes.text, classes.trend]">
							<ui-text token="text-200-r">
								{{ props.data.yoy_change.value }} pp
							</ui-text>
							<ui-icon
								:id="isUpTrend ? IconIds.Gainers : IconIds.Loosers"
								height="6px"
								width="6px"
							/>
						</div>
					</div>
					<div :class="classes.chart">
						<chart-component :points="props.data.chart" />
					</div>
				</div>
			</div>
		</base-ticker-widget-content>
	</base-ticker-widget-wrapper>
</template>

<style module="classes">
.wrapper {
	display: flex;
	flex-grow: 1;
	width: 100%;
	min-width: 0;
}

.container {
	display: flex;
	flex-grow: 1;
	min-width: 0;
	gap: 12px;
	padding: 12px 0 12px 20px;
	overflow: hidden;
}

.textContainer {
	display: flex;
	flex: 0 0 120px;
	flex-direction: column;
}

.title {
	display: flex;
	align-items: center;
	color: rgb(255 255 255 / 96%);
	gap: 6px;
}

.flag {
	width: 20px;
	height: 20px;
	border-radius: 50%;
	object-fit: cover;
	object-position: 25%;
}

.text {
	color: rgb(255 255 255 / 62%);
}

.trend {
	display: inline-flex;
	align-items: center;
	gap: var(--padding-padding-s4, 6px);
}

.chart {
	flex-grow: 1;
	min-width: 0;
	height: 100%;
}
</style>
