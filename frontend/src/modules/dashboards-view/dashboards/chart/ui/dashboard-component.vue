<script setup lang="ts">
import { BaseDashboardComponent } from '../../base/index.ts';
</script>

<template>
	<base-dashboard-component :class="classes.root">
		<template #title>
			<div>BTCUSDT</div>
		</template>
	</base-dashboard-component>
</template>

<style module="classes">
.root {
	height: 584px;
}
</style>
