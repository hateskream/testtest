<script setup lang="ts">
import type { ISectionItem } from '../../../../models';
import { SectorsTickerWidget } from '@/modules/widgets/sectors';
import { useTickerContext } from '@/modules/ticker/composables';
interface ISectionProps {
	section: ISectionItem;
}

defineProps<ISectionProps>();

const { tickerId } = useTickerContext();

</script>

<template>
	<div>
		<sectors-ticker-widget :meta="{ tickerId, name: 'Sectors' }" />
	</div>
</template>
