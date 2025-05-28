<script setup lang="ts">
</script>

<template>
	<div :class="classes.header">
		<slot name="logo" />
		<div :class="classes.market">
			<slot name="market" />
		</div>
		<div class="market-price">
			<slot name="price" />
		</div>
	</div>
</template>

<style module="classes">
.header {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	padding: 12px 0;
	gap: 12px;
}


.market {
	display: flex;
	flex-direction: column;
	gap: 3px;
	padding: 0 16px;
}
</style>
