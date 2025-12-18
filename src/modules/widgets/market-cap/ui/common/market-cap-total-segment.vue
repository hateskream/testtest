<script setup lang="ts">

import { UiText } from '@/shared/ui/text';

interface IMarketCapSummarySegmentProps {
	name: string;
}

const props = defineProps<IMarketCapSummarySegmentProps>();
</script>

<template>
	<div :class="classes.segment">
		<ui-text
			:class="classes.name"
			as="div"
			token="text-200-r"
		>
			{{props.name}}
		</ui-text>
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
	color: var(--text-color-base-300);
}

.row {
	display: flex;
	align-items: center;
	gap: 6px;
}
</style>
