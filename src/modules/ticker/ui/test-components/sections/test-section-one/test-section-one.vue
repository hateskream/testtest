<script setup lang="ts">
import { computed } from 'vue';

import { isFeatureEnabled } from '@/shared/lib';
const isPricerPerformanceEnabled = computed(()=> isFeatureEnabled('TICKER_WIDGET_PRICE_PERFORMANCE_ENABLED'));
</script>

<template>
	<div v-if="isPricerPerformanceEnabled">
	</div>
</template>

<style module="classes">


</style>
