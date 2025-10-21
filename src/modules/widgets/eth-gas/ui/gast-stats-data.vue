<script setup lang="ts">
export interface IGasStatsData {
	lastBlock: number;
	avgBlockSize: number;
	pendingQueue: number;
	avgUtilization: number;
}

export interface IGasStatsCardProps {
	data: IGasStatsData;
	isTable?: boolean; // true = вертикальная таблица, false = горизонтальная линия
}

const props = withDefaults(defineProps<IGasStatsCardProps>(), {
	isTable: true
});
</script>

<template>
	<div :class="[classes.card, { [classes.line]: !isTable, [classes.table]: isTable }]">
		<div :class="classes.stats">
			<div :class="classes.statItem">
				<div :class="classes.statLabel">Last block</div>
				<div :class="classes.statValue">{{ props.data.lastBlock.toLocaleString() }}</div>
			</div>

			<div :class="classes.statItem">
				<div :class="classes.statLabel">Avg Block Size</div>
				<div :class="classes.statValue">{{ props.data.avgBlockSize }}</div>
			</div>

			<div :class="classes.statItem">
				<div :class="classes.statLabel">Pending queue</div>
				<div :class="classes.statValue">{{ props.data.pendingQueue.toLocaleString() }}</div>
			</div>

			<div :class="classes.statItem">
				<div :class="classes.statLabel">Avg Utilization</div>
				<div :class="classes.statValue">{{ props.data.avgUtilization.toFixed(1) }}%</div>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.card {
	display: flex;
	flex-direction: column;
	height: fit-content;
	padding: 16px;
	background: #171717;
	border-radius: 8px;
}

.stats {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.statItem {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.statLabel {
	font-weight: 400;
	font-size: 12px;
	color: rgb(255 255 255 / 50%);
}

.statValue {
	line-height: 1.2;
	color: #ffffff;
	font-size: 16px;
}

/* Режим линии (isTable = false) */
.line {
	flex-direction: row;
	align-items: center;
	height: auto;
	padding: 12px 16px;
}

.line .stats {
	flex: 1;
	flex-direction: row;
	gap: 32px;
}

.line .statItem {
	flex: 1;
	min-width: 0;
}

.line .statValue {
	font-size: 18px;
}
.table {
	.stats {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
}
</style>
