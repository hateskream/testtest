<script setup lang="ts">
import ChartComponent from './chart-component.vue';

</script>

<template>
	<div :class="classes.container">
		<div :class="classes.chart">
			<chart-component />
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
}

.header {
	display: flex;
	justify-content: space-between;
	padding: 32px 20px 12px;
}

.chart {
	flex-grow: 1;
	padding: 32px 20px 12px;
}
</style>
