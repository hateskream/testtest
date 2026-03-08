<script setup lang="ts">
import { useTickerContext } from '../../../../composables';
import type { ISectionItem } from '../../../../models';
import { AnalystRatingsTickerWidget } from '@/modules/widgets/analyst-ratings';

interface ISectionProps {
	section: ISectionItem;
}

defineProps<ISectionProps>();

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
