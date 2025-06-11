<script setup lang="ts">
import { ChartCommonTooltip, ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';


interface ICapitalStructureProps {
	values: {
		marketCap: string | number | null;
		totalDebt: string | number | null;
		cashAndInv: string | number | null;
		enterpriseValue: string | number | null;
	};
}

const props = defineProps<ICapitalStructureProps>();
</script>

<template>
	<chart-common-widget-layout>
		<template #header>Capital Structure</template>
		<template #body>
			<div :class="classes.capitalStructure" class="paragraph-p-01">
				<div :class="classes.metricsTable">
					<div :class="classes.metricLabel"></div>
					<div :class="classes.metricValue">
					</div>

					<div :class="classes.metricLabel">Market Cap</div>
					<div :class="classes.metricValue">
						<template v-if="props.values.marketCap != null">
							{{ props.values.marketCap }}
							<chart-common-tooltip />
						</template>
						<template v-else><span :class="classes.emptyValue">--</span></template>
					</div>

					<div :class="classes.metricLabel">Total Debt</div>
					<div :class="classes.metricValue">
						<template v-if="props.values.totalDebt != null">
							{{ props.values.totalDebt }}
							<chart-common-tooltip />
						</template>
						<template v-else><span :class="classes.emptyValue">--</span></template>
					</div>

					<div :class="classes.metricLabel">Cash & Inv.</div>
					<div :class="classes.metricValue">
						<template v-if="props.values.cashAndInv != null">
							{{ props.values.cashAndInv }}
							<chart-common-tooltip />
						</template>
						<template v-else><span :class="classes.emptyValue">--</span></template>
					</div>

					<div :class="classes.metricLabel">Enterprise Value</div>
					<div :class="classes.metricValue">
						<template v-if="props.values.enterpriseValue != null">
							{{ props.values.enterpriseValue }}
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
.capitalStructure {
	width: 100%;
}

.metricsTable {
	display: grid;
	grid-template-columns: 1fr 84px;
	row-gap: 4px;
	column-gap: 3px;
	grid-auto-rows: 32px;
}

.metricLabel {
	display: flex;
	align-items: center;
	width: 100%;
	height: 100%;
	color: var(--text-color-base-300);
}

.metricValue {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	width: 100%;
	height: 100%;
	color: var(--text-color-base-500);
	gap: 3px;
}

.emptyValue {
	padding-right: 17px;
	color: var(--text-color-base-100);
}
</style>
