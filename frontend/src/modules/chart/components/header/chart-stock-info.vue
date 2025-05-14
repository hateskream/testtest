<script setup lang="ts">
const tickerName = 'Tesla inc'
</script>

<template>
	<div :class="classes.stockInfoWrapper">
		<div :class="classes.tickerName" class="header-h01">{{tickerName}}</div>
		<div>
			<div>select will be here</div>
		</div>
	</div>
</template>

<style module="classes">
.stockInfoWrapper {
	display: flex;
	gap: 12px;
	align-items:center;
}
.tickerName {
	color: var(--text-color-base-500)
}
</style>
