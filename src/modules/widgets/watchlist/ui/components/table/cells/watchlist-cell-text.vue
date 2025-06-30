<script setup lang="ts">
import type { IWatchlistTextCell } from '../../../../model';

interface IProps {
	cell: IWatchlistTextCell;
}

const props = defineProps<IProps>();
</script>

<template>
	<div :class="classes.text">
		{{ props.cell.value || '—' }}
	</div>
</template>

<style module="classes">
.text {
	font-style: normal;
	font-weight: 400;
	font-size: 13px;
	color: var(--text-color-base-500);
	letter-spacing: 0.143px;
}
</style>
