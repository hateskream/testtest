<script setup lang="ts">
import { type IWatchlistTextCell } from '@/modules/widgets/watchlist/model';

interface IProps {
	data: IWatchlistTextCell;
}

const props = defineProps<IProps>();
</script>

<template>
	<div :class="classes.text">
		{{ props.data.value || '—' }}
	</div>
</template>

<style module="classes">
.text {
	overflow: hidden;
	font-style: normal;
	font-weight: 400;
	font-size: 13px;
	color: var(--text-color-base-500);
	letter-spacing: 0.143px;
	text-wrap: nowrap;
}
</style>
