<script setup lang="ts">
import { computed } from 'vue';

import { type IWatchlistTextCell } from '@/modules/widgets/watchlist/model';

interface IProps {
	data: IWatchlistTextCell;
	align?: 'left' | 'right';
}

const props = defineProps<IProps>();

const alignmentStyle = computed(() => {
	return props.align === 'left' ? { 'text-align': 'left' } : { 'text-align': 'right' };
});
</script>

<template>
	<div
		:class="classes.text"
		:style="alignmentStyle"
		class="paragraph-p-00"
	>
		{{ props.data?.value ?? '—' }}
	</div>
</template>

<style module="classes">
.text {
	line-height: 1;
	text-align: right;
	color: var(--text-color-base-500);
}
</style>
