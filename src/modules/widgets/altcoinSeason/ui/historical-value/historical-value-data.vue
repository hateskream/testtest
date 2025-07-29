<script setup lang="ts">

// interface IHistoricalValueDataProps {
// 	data: string;
// }

// const props = defineProps<IHistoricalValueDataProps>();

</script>

<template>
	<div :class="classes.historicalValueData">
		<div :class="classes.dataItem">
			<div :class="classes.dataItemTitle">Today</div>
			<div :class="classes.dataItemValue">23</div>
		</div>
		<div :class="classes.dataItem">
			<div :class="classes.dataItemTitle">Last week</div>
			<div :class="classes.dataItemValue">24</div>
		</div>
		<div :class="classes.dataItem">
			<div :class="classes.dataItemTitle">Last month</div>
			<div :class="classes.dataItemValue">26</div>
		</div>
	</div>
</template>

<style module="classes">
.historicalValueData {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-self: stretch;
	height: 100%;
}

.dataItem {
	display: inline-flex;
	justify-content: space-between;
	align-self: stretch;
	font-weight: 440;
	font-size: var(--typography-paragraph-size-p-01, 12px);
	color: var(--color-text-base-300, #9a9a9d);
	letter-spacing: 0.096px;
}

.dataItemValue {
	color: #feb358;
}

.dataItem:nth-child(3) .dataItemValue {
	color: var(--color-text-base-300, #9a9a9d);
}
</style>
