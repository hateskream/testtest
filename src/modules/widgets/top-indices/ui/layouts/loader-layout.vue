<script setup lang="ts">
import type { CSSProperties } from 'vue';

import { UiSkeletonGroup } from '@/shared/ui/skeleton';

interface ISkeletonGroupProps {
	count?: number;
	height?: CSSProperties['height'];
	borderRadius?: CSSProperties['borderRadius'];
}

const props = defineProps<ISkeletonGroupProps>();
</script>

<template>
	<div :class="classes.loaderLayout">
		<ui-skeleton-group
			:height="props.height"
			:border-radius="props.borderRadius"
			:count="props.count"
		/>
	</div>
</template>

<style module="classes">
.loaderLayout {
	padding: 10px;
}
</style>
