<script setup lang="ts">
import { useTickerContext } from '../../../composables';
import type { ISectionItem } from '../../../models';
import { AnalystRatingsTickerWidget } from '@/modules/widgets/analyst-ratings';

interface ISectionProps {
	section: ISectionItem;
}

defineProps<ISectionProps>();

const { tickerId } = useTickerContext();
</script>

<template>
	<div>
		<analyst-ratings-ticker-widget :meta="{ tickerId, name: 'Analyst Ratings' }" />

	</div>
</template>
