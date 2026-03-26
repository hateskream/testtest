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
	<div :class="classes.section">
		<price-performance-ticker-widget :meta="{ tickerId, name: 'Price performance' }" />
	</div>
</template>

<style module="classes">
.section {
	display: flex;
	flex-direction: column;
	gap: var(--padding-s4, 6px);
}
</style>
