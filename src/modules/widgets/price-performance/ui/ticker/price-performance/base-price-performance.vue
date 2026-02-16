<script setup lang="ts">
import { computed, ref } from 'vue';
import { formatDistanceToNowStrict } from 'date-fns';

import { RangeLine, PriceInfo } from '../../common';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { type PricePerformance, PriceRangePreset, type PriceRangePresetType } from '../../../model';
import { BaseTickerWidgetContent, BaseTickerWidgetHeader, BaseTickerWidgetWrapper } from '@/modules/widgets/base';
import { type ITickerWidgetMeta, TickerBaseListDivider } from '@/modules/ticker';
import { getDateFormatter } from '@/shared/lib';


interface IProps {
	data: PricePerformance;
	meta: ITickerWidgetMeta;
}

const props = defineProps<IProps>();

const selectedPeriod = ref<PriceRangePresetType>(PriceRangePreset.Day);


const currencySymbol = computed(() => props.data.prefix);

function formatValue(value: number | undefined): string {
	if (value === undefined) {
		return '';
	}
	const suffix = props.data.suffix ? `/${props.data.suffix}` : '';
	return `${currencySymbol.value}${value.toFixed(2)}${suffix}`;
}

function extractTime(isoString: string): string {
	if (!isoString) {
		return '';
	}
	const date = new Date(isoString);
	return date.toTimeString().split(' ')[0];
}

const isUpTrend = computed(() => props.data.changeIsPositive);


function formatDate(date: string) {
	const shortFormatter = getDateFormatter({
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});

	const short = shortFormatter.format(new Date(date));
	const relative = formatDistanceToNowStrict(new Date(date), {
		roundingMethod: 'ceil',
		addSuffix: true,
	});

	return `${short} (${relative})`;
}


</script>

<template>
	<base-ticker-widget-wrapper>
		<base-ticker-widget-header>
			{{props.meta.name}}
		</base-ticker-widget-header>
		<base-ticker-widget-content>

			<div :class="classes.container">
				<div :class="classes.bodyWrapper">
					<div :class="classes.topPartWrapper">
						<range-line
							v-if="props.data.ranges"
							v-model="selectedPeriod"
							:ranges="props.data.ranges"
							:current-value="props.data.value"
							:symbol="props.data.prefix"
						/>
						<div :class="classes.chartPriceWrapper">
							<price-info
								:is-market-open="props.data.isOpen"
								:price="props.data.value"
								:currency-symbol="props.data.prefix"
								:open-time="extractTime(props.data.openTime)"
								:close-time="extractTime(props.data.openTime)"
								:suffix="props.data.suffix"
							>
								<div
									:class="[isUpTrend ? classes.positive : classes.negative, classes.trendWrapper]"
									class="text-100-r"
								>
									<ui-icon
										:id="isUpTrend ? IconIds.Gainers : IconIds.Loosers"
										:class="classes.iconFix"
										height="8px"
										width="8px"
									/>
									{{ props.data.valueChangeAbs.toFixed(2) }}
									({{ props.data.valueChangePerc.toFixed(2) }}%)
								</div>
							</price-info>
						</div>
						<ticker-base-list-divider :class="classes.firstDivider" />
					</div>


					<div :class="classes.metricsGrid">
						<div :class="classes.metricItem">
							<div :class="classes.metricLabel" class="text-100-r">Open</div>
							<div class="text-100-r">{{ formatValue(props.data.openPrice) }}</div>
						</div>

						<div :class="[classes.metricItem, classes.alignRight]">
							<div :class="classes.metricLabel" class="text-100-r">Previous close</div>
							<div class="text-100-r">{{ formatValue(props.data.previousClose) }}</div>
						</div>

						<div v-if="props.data.average50" :class="classes.metricItem">
							<div :class="classes.metricLabel" class="text-100-r">Average, 50 days</div>
							<div class="text-100-r">{{ formatValue(props.data.average50) }}</div>
						</div>

						<div v-if="props.data.average200" :class="[classes.metricItem, classes.alignRight]">
							<div :class="classes.metricLabel" class="text-100-r">Average, 200 days</div>
							<div class="text-100-r">{{ formatValue(props.data.average200) }}</div>
						</div>
						<ticker-base-list-divider :class="classes.fullWidth" />
						<div v-if="props.data.ath" :class="[classes.metricItem, classes.fullWidth]">
							<div :class="classes.metricRow">
								<div class="text-300-r">All-time high</div>
								<div class="text-300-r">{{ formatValue(props.data.ath!.allTimeHighAbs) }}</div>
							</div>
							<div :class="classes.metricRow">
								<div class="text-100-r" :class="classes.secondaryText">
									{{ formatDate(props.data.ath!.allTimeHighDate) }}
								</div>
								<div
									class="text-100-r"
									:class="props.data.ath!.allTimeHighPerc >= 0 ? classes.positive : classes.negative"
								>
									{{ props.data.ath!.allTimeHighPerc.toFixed(2) }}%
								</div>
							</div>
						</div>

						<div v-if="props.data.atl" :class="[classes.metricItem, classes.fullWidth]">
							<div :class="classes.metricRow">
								<div class="text-300-r">All-time low</div>
								<div class="text-300-r">{{ formatValue(props.data.atl!.allTimeLowAbs) }}</div>
							</div>
							<div :class="classes.metricRow">
								<div class="text-100-r" :class="classes.secondaryText">
									{{ formatDate(props.data.atl!.allTimeLowDate) }}
								</div>
								<div
									class="text-100-r"
									:class="props.data.atl!.allTimeLowPerc >= 0 ? classes.positive : classes.negative"
								>
									{{ props.data.atl!.allTimeLowPerc.toFixed(2) }}%
								</div>
							</div>
						</div>
					</div>

				</div>
			</div>
		</base-ticker-widget-content>
	</base-ticker-widget-wrapper>
</template>

<style module="classes">
.container {
	container-type: inline-size;
	width: 100%;
}

.bodyWrapper {
	display: flex;
	flex-direction: column;
}

.topPartWrapper {
	padding: 0 20px;
}

.chartPriceWrapper {
	padding: 12px 0;
}

.metricsGrid {
	display: grid;
	padding: 5px 20px;
	grid-template-columns: 1fr 1fr;
}

.separator {
	grid-column: 1 / -1;
	height: 1px;
	background-color: var(--border-color-surface-02);
}

.metricItem {
	display: flex;
	flex-direction: column;
	padding: 12px 0;
	gap: 2px;
}

.metricLabel {
	margin-right: 4px;
	color: var(--text-color-base-300);
}

.alignRight {
	align-items: flex-end;
}

.trendWrapper {
	display: flex;
	align-items: center;
	padding: 2px 0 2px 8px;
	gap: 4px;
}

.negative {
	color: var(--metrics-color-negative-chart);
}

.positive {
	color: var(--metrics-color-positive-chart);

	.iconFix {
		transform: translateY(-1px);
	}
}

.fullWidth {
	grid-column: 1 / -1;
}

.metricRow {
	display: flex;
	justify-content: space-between;
	width: 100%;
}

.secondaryText {
	color: var(--text-color-base-300);
}

@container (width > 500px) {
	.bodyWrapper {
		flex-direction: row;
		gap: 60px;
	}

	.bodyWrapper > div {
		flex: 1;
	}

	.metricItem:first-child,
	.metricItem:nth-child(2) {
		padding-top: 0;
	}

	.metricsGrid {
		padding-top: 0;
	}

	.bodyWrapper > .metricsGrid {
		flex: 300px 0 0;
		border-top: none;
	}

	.trendWrapper {
		display: flex;
		align-items: center;
	}

	.firstDivider {
		display: none;
	}
}
</style>
