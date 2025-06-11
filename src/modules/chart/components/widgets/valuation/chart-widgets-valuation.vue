<script setup lang="ts">
import { ChartCommonTooltip, ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';

interface IMetricValue {
	ltm: string | number | null;
	ntm: string | number | null;
}

interface IMetricValues {
	pe: IMetricValue;
	evSales: IMetricValue;
	evEbitda: IMetricValue;
	priceBook: IMetricValue;
}

interface IValuationProps {
	values: IMetricValues;
}

const props = defineProps<IValuationProps>();
</script>


<template>
	<chart-common-widget-layout>
		<template #header>Valuation metrics</template>
		<template #body>
			<div :class="classes.financialMetrics" class="paragraph-p-01">
				<div :class="classes.metricsTable">

					<div :class="classes.metricLabelHeader"></div>
					<div :class="classes.metricValueHeader">LTM</div>
					<div :class="classes.metricValueHeader">NTM</div>


					<div :class="classes.metricLabel">P/E</div>
					<div :class="classes.metricValue">
						<template v-if="props.values.pe.ltm != null">
							{{ props.values.pe.ltm }}<span :class="classes.multiplier">x</span>
							<chart-common-tooltip />
						</template>
						<template v-else><span :class="classes.emptyValue">--</span></template>
					</div>
					<div :class="classes.metricValue">
						<template v-if="props.values.pe.ntm != null">
							{{ props.values.pe.ntm }}<span :class="classes.multiplier">x</span>
							<chart-common-tooltip />
						</template>
						<template v-else><span :class="classes.emptyValue">--</span></template>
					</div>


					<div :class="classes.metricLabel">EV/Sales</div>
					<div :class="classes.metricValue">
						<template v-if="props.values.evSales.ltm != null">
							{{ props.values.evSales.ltm }}<span :class="classes.multiplier">x</span>
							<chart-common-tooltip />
						</template>
						<template v-else><span :class="classes.emptyValue">--</span></template>
					</div>
					<div :class="classes.metricValue">
						<template v-if="props.values.evSales.ntm != null">
							{{ props.values.evSales.ntm }}<span :class="classes.multiplier">x</span>
							<chart-common-tooltip />
						</template>
						<template v-else><span :class="classes.emptyValue">--</span></template>
					</div>


					<div :class="classes.metricLabel">EV/EBITDA</div>
					<div :class="classes.metricValue">
						<template v-if="props.values.evEbitda.ltm != null">
							{{ props.values.evEbitda.ltm }}<span :class="classes.multiplier">x</span>
							<chart-common-tooltip />
						</template>
						<template v-else><span :class="classes.emptyValue">--</span></template>
					</div>
					<div :class="classes.metricValue">
						<template v-if="props.values.evEbitda.ntm != null">
							{{ props.values.evEbitda.ntm }}<span :class="classes.multiplier">x</span>
							<chart-common-tooltip />
						</template>

						<template v-else><span :class="classes.emptyValue">--</span></template>
					</div>


					<div :class="classes.metricLabel">Price/Book</div>
					<div :class="classes.metricValue">
						<template v-if="props.values.priceBook.ltm != null">
							{{ props.values.priceBook.ltm }}<span :class="classes.multiplier">x</span>
							<chart-common-tooltip />
						</template>
						<template v-else><span :class="classes.emptyValue">--</span></template>
					</div>
					<div :class="classes.metricValue">
						<template v-if="props.values.priceBook.ntm != null">
							{{ props.values.priceBook.ntm }}<span :class="classes.multiplier">x</span>
							<chart-common-tooltip />
						</template>
						<template v-else><span :class="classes.emptyValue">--</span></template>
					</div>
				</div>
			</div>
		</template>
	</chart-common-widget-layout>
</template>


<style module="classes">
.financialMetrics {
	width: 100%;
}

.metricsTable {
	display: grid;
	grid-template-columns: 1fr 84px 84px;
	row-gap: 4px;
	column-gap: 3px;
	grid-auto-rows: 32px;
}

.metricLabel {
	color: var(--text-color-base-300);
	display:flex;
	align-items:center;

	height:100%;
	width:100%;
}


.metricValue {
	color: var(--text-color-base-500);
	display:flex;
	gap: 3px;
	align-items:center;
	justify-content: flex-end;
	height:100%;
	width:100%;
}

.metricValueHeader {
	color: var(--text-color-base-300);
	display:flex;
	align-items:center;
	justify-content: flex-end;
	height:100%;
	padding-right:17px;
	width:100%;
}


.emptyValue {
	padding-right:17px;
	color: var(--text-color-base-100);
}
</style>
