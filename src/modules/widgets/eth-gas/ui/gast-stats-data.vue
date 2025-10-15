<script setup lang="ts">
export interface IGasStatsData {
	lastBlock: number;
	avgBlockSize: number;
	pendingQueue: number;
	avgUtilization: number;
}

export interface IGasStatsCardProps {
	data: IGasStatsData;
	isHorizontal?: boolean;
}

const props = defineProps<IGasStatsCardProps>();
</script>

<template>
	<div :class="[classes.card, { [classes.horizontal]: isHorizontal }]">
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
	height: 100%;
	padding: 16px;
	background: #171717;
	border-radius: 8px;
}

.header {
	margin-bottom: 20px;
	font-weight: 500;
	font-size: 14px;
	color: rgb(255 255 255 / 50%);
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
}

/* Горизонтальный режим */
.horizontal {
	flex-direction: row;
	align-items: center;
	height: auto;
	padding: 12px 16px;
}

.horizontal .header {
	flex-shrink: 0;
	margin-right: 32px;
	margin-bottom: 0;
}

.horizontal .stats {
	flex: 1;
	flex-direction: row;
	gap: 32px;
}

.horizontal .statItem {
	flex: 1;
	min-width: 0;
}

.horizontal .statValue {
	font-size: 18px;
}
</style>
