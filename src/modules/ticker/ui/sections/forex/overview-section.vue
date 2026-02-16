<script setup lang="ts">
import type { ISectionItem } from '../../../models';
import { PricePerformanceTickerWidget } from '@/modules/widgets/price-performance';
import { useTickerContext } from '@/modules/ticker/composables';
interface ISectionProps {
	section: ISectionItem;
}

defineProps<ISectionProps>();

const { tickerId } = useTickerContext();

</script>

<template>
	<div>
		<price-performance-ticker-widget :meta="{ tickerId, name: 'Price performance' }" />
	</div>
</template>
