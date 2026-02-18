<script setup lang="ts">
import { TickerUnemploymentRateWidget } from '@/modules/widgets/unemployment-rate';
</script>

<template>
	<div :style="{ width: '305px' }">
		<ticker-unemployment-rate-widget :meta="{ tickerId: 'Crypto-BTC-Bitcoin', name: 'Unemployment Rate (1Y)' }" />
	</div>
</template>

<style module="classes">

</style>
