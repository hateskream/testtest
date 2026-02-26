<script setup lang="ts">
import { NonfarmPayrollsTickerWidget } from '@/modules/widgets/nonfarm-payrolls';
</script>

<template>
	<div :style="{ width: '300px' }">
		<nonfarm-payrolls-ticker-widget :meta="{ tickerId: 'Crypto-BTC-Bitcoin', name: 'Nonfarm Payrolls (1Y)' }" />
	</div>
</template>

<style module="classes">

</style>
