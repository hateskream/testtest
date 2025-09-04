<script setup lang="ts">
import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';

interface ITop10WeightsWidgetProps {
	top10Weight?: number;
	totalHoldings?: number;
}

const props = withDefaults(defineProps<ITop10WeightsWidgetProps>(), {
	top10Weight: 53.99,
	totalHoldings: 31,
});
</script>

<template>
	<chart-common-widget-layout>
		<template #header>
			<div :class="classes.wrapperTitle">
				<div :class="classes.title">
					Top 10 Weights
				</div>
			</div>
		</template>
		<template #body>
			<div :class="classes.addresses">
				<div :class="classes.address">
					<div :class="classes.addressPercent">
						{{ props.top10Weight }}%
					</div>
				</div>

				<div :class="classes.address">
					<div :class="classes.addressPercent">
						{{ props.totalHoldings }} total holdings
					</div>
				</div>
			</div>

			<div :class="classes.lineText">
				<div :class="classes.lineTextItem">
					<div :class="classes.addressIntervalCircle" style="background-color: #ffffff;" />
					<span :class="classes.lineTextItemText">
						Top 10 Weight
					</span>
				</div>

				<div :class="classes.lineTextItem">
					<div :class="classes.addressIntervalCircle" style="background-color: rgb(119 119 121 / 100%);" />
					<span :class="classes.lineTextItemText">
						All Holdings
					</span>
				</div>
			</div>

			<div :class="classes.line">
				<div
					:class="classes.lineItem"
					:style="{background: '#fff', width: `${props.top10Weight}%`}"
				/>
				<div
					:class="classes.lineItem"
					:style="{background: 'rgba(255, 255, 255, 0.30)', width: `${100 - props.top10Weight}%`}"
				/>
			</div>
		</template>
	</chart-common-widget-layout>
</template>


<style module="classes">
.line {
	display: flex;
	align-items: center;
	margin-top: 10px;
}

.lineItem {
	height: 14px;
}

.line .lineItem:first-child {
	border-top-left-radius: 4px;
	border-bottom-left-radius: 4px;
}

.line .lineItem:last-child {
	border-top-right-radius: 4px;
	border-bottom-right-radius: 4px;
}

.lineTextItem {
	display: flex;
	gap: 4px;
	align-items: center;
}

.lineText {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 10px;
}

.lineTextItemText {
	font-style: normal;
	font-weight: 440;
	font-size: 10px;
	color: var(--text-color-base-300, #9a9a9d);
	letter-spacing: 0.08px;
}

.addresses {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 12px;
}

.wrapperTitle {
	display: flex;
	gap: 8px;
	align-items: center;
}

.title {
	font-style: normal;
	font-weight: 300;
	font-size: 13px;
	color: var(--text-color-base-300);
	letter-spacing: 0.104px;
}

.addressPercent {
	margin-top: 4px;
	font-style: normal;
	font-weight: 400;
	font-size: 15px;
	color: #ffffff;
	letter-spacing: 0.165px;
}

.addressIntervalText {
	font-style: normal;
	font-weight: 440;
	font-size: 10px;
	color: var(--text-color-base-300, #9a9a9d);
	letter-spacing: 0.08px;
}

.addressInterval {
	display: flex;
	align-items: center;
	gap: 4px;
}

.addressIntervalCircle {
	width: 2px;
	height: 2px;
	border-radius: 100%;
}
</style>
