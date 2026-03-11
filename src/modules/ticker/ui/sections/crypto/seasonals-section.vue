<script setup lang="ts">
import type { ISectionItem } from '../../../models';
import { SeasonalsTickerWidget } from '@/modules/widgets/seasonals';
import { useTickerContext } from '@/modules/ticker/composables';

interface ISectionProps {
	section: ISectionItem;
}

defineProps<ISectionProps>();

const { tickerId } = useTickerContext();
</script>

<template>
	<div :class="classes.section">
		<seasonals-ticker-widget :meta="{ tickerId, name: 'Seasonals' }" />
	</div>
</template>

<style module="classes">
.section {
	display: flex;
	flex-direction: column;
}
</style>
