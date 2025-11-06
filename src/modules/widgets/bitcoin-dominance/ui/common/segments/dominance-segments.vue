<script setup lang="ts">
import type { IDominanceSnapshot, IDominanceSnapshotValues } from '../../../model';

import DominanceSegmentsIndicator from './dominance-segments-indicator.vue';

interface IViewComponentProps {
	snapshots: IDominanceSnapshot[];
	other: IDominanceSnapshotValues;
	isShowSegments?: boolean;
	isShowIndicator?: boolean;
}

const props = defineProps<IViewComponentProps>();
</script>

<template>
	<div :class="classes.root">
		<div v-if="isShowSegments" :class="classes.segments">
			<div
				v-for="item in props.snapshots"
				:key="item.symbol"
				:class="classes.ticker"
			>
				<div :class="classes.name">
					<div :class="classes.circle" :style="{backgroundColor: item.color}"></div>
					<span>
						{{ item.symbol }}
					</span>
				</div>
				<div :class="classes.value">
					{{ item.dominance.current.toFixed(1) }}%
				</div>
			</div>
			<div
				:class="classes.ticker"
			>
				<div :class="classes.name">
					<div :class="classes.circle" :style="{backgroundColor: '#fff'}"></div>
					<span>Other</span>
				</div>

				<div :class="classes.value">
					{{ props.other.current.toFixed(1) }}%
				</div>
			</div>
		</div>
		<dominance-segments-indicator
			v-if="isShowIndicator"
			:snapshots="props.snapshots"
			:other="props.other"
		/>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
}

.segments {
	display: flex;
	flex-wrap: wrap;
	overflow-y: auto;
	row-gap: 4px;
	scrollbar-width: none;
}

.ticker {
	display: flex;
	flex-direction: column;
	width: 80px;
}

.name {
	display: flex;
	align-items: center;
	gap: 6px;
	font-weight: 400;
	font-size: 13px;
	color: var(--text-color-base-300);
}

.circle {
	width: 4px;
	height: 4px;
	border-radius: 100%;
}

.value {
	font-weight: 400;
	font-size: 16px;
	line-height: 160%;
	color: #ffffff;
}
</style>
