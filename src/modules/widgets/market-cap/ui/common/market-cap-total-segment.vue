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
	font-weight: 400;
	font-size: var(--font-text-200-r-size, 12.2px);
	line-height: 180%;
	color: var(--text-color-base-300);
	letter-spacing: 0.122px;
}

.row {
	display: flex;
	align-items: center;
	gap: 6px;
}
</style>
