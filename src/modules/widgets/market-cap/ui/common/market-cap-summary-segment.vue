<script setup lang="ts">

interface IMarketCapSummarySegmentProps {
	name: string;
}

const props = defineProps<IMarketCapSummarySegmentProps>();
</script>

<template>
	<div :class="classes.segment">
		<div :class="classes.name">
			{{props.name}}
		</div>
		<div :class="classes.row">
			<slot />
		</div>
	</div>
</template>

<style module="classes">
.segment {
	flex-shrink: 0;
}

.name {
	margin-bottom: 2px;
	font-size: 13.3px;
	line-height: 180%;
	color: var(--text-color-base-300);
}

.row {
	display: flex;
	align-items: center;
	gap: 6px;
}
</style>
