<script setup lang="ts">
import { ErrorNetworkComponent } from '@/modules/widgets/base';
</script>

<template>
	<div :class="classes.errorLayout">
		<error-network-component />
	</div>
</template>

<style module="classes">
.errorLayout {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
}
</style>
