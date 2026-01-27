<script setup lang="ts">
import { useTickerContext } from '../../composables';

const { tickerId, tickerType } = useTickerContext();
</script>

<template>
	<div :class="classes.header">
		<span :class="classes.title">Footer {{tickerType}} {{tickerId}}</span>
	</div>
</template>

<style module="classes">
.header {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 80px;
	background-color: var(--bg-color-surface-00);
	border-top: 1px solid var(--bg-color-surface-01-activated);
}

.title {
	font-weight: 600;
	font-size: 20px;
	color: var(--text-color-base-100);
}
</style>
