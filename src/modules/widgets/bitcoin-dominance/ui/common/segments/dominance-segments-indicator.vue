<script setup lang="ts">
import type { IDominanceSnapshot, IDominanceSnapshotValues } from '../../../model';


interface IDominanceIndicatorProps {
	snapshots: IDominanceSnapshot[];
	other: IDominanceSnapshotValues;
}

const props = defineProps<IDominanceIndicatorProps>();
</script>

<template>
	<div :class="classes.line">
		<div
			v-for="item in props.snapshots"
			:key="item.symbol"
			:class="classes.segment"
			:style="{background: item.color, width: `${item.dominance.current}%`}"
		/>
		<div
			:class="classes.segment"
			:style="{background: '#fff', width: `${props.other.current}%`}"
		/>
	</div>

</template>

<style module="classes">
.line {
	display: flex;
	align-items: center;
	margin-top: 10px;
	padding: 1px;
	gap: 1px;
	background-color: rgb(5 5 5 / 40%);
	border-radius: 4px;
}

.segment {
	height: 14px;
}

.segment:first-child {
	border-top-left-radius: 4px;
	border-bottom-left-radius: 4px;
}

.segment:last-child {
	border-top-right-radius: 4px;
	border-bottom-right-radius: 4px;
}
</style>
