<script setup lang="ts">
import { RealGdpTickerWidget } from '@/modules/widgets/real-gdp';
</script>

<template>
	<real-gdp-ticker-widget :class="classes.nominal" />
</template>

<style module="classes">
.nominal {
	width: 100%;
	height: 330px;
}
</style>
