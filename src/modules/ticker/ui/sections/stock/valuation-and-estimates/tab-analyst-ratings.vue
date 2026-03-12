<script setup lang="ts">
import { useTickerContext } from '../../../../composables';
import { AnalystRatingsTickerWidget } from '@/modules/widgets/analyst-ratings';

const { tickerId } = useTickerContext();
</script>

<template>
	<analyst-ratings-ticker-widget :class="classes.widget" :meta="{ tickerId, name: 'Analyst Ratings' }" />
</template>

<style module="classes">
.widget {
	width: 100%;
}
</style>
