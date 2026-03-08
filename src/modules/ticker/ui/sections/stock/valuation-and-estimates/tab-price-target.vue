<script setup lang="ts">
import { useTickerContext } from '../../../../composables';
import type { ISectionItem } from '../../../../models';
import { PriceTargetTickerWidget } from '@/modules/widgets/price-target';

interface ISectionProps {
	section: ISectionItem;
}

defineProps<ISectionProps>();

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
