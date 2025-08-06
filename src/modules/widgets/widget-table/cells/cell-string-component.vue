<script setup lang="ts">
import { type IWatchlistTextCell } from '@/modules/widgets/watchlist/model';

interface IProps {
	data: IWatchlistTextCell;
}

const props = defineProps<IProps>();
</script>

<template>
	<div :class="classes.text" class="paragraph-p-00">
		{{ props.data.value || '—' }}
	</div>
</template>

<style module="classes">
.text {
	line-height: 1;
	text-align: right;
	color: var(--text-color-base-500);
}
</style>
