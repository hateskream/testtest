<script setup lang="ts">
import { useTickerContext } from '../../../../composables';
import { PriceTargetTickerWidget } from '@/modules/widgets/price-target';

const { tickerId } = useTickerContext();
</script>

<template>
	<price-target-ticker-widget :class="classes.widget" :meta="{ tickerId, name: 'Price Target' }" />
</template>

<style module="classes">
.widget {
	width: 100%;
}
</style>
