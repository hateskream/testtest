<script setup lang="ts">
import { useTickerContext } from '../../../composables';
import type { ISectionItem } from '../../../models';

import EmptyTickerWidget from '../empty-ticker-widget.vue';

interface ISectionProps {
	section: ISectionItem;
}

defineProps<ISectionProps>();

const { tickerId } = useTickerContext();
</script>

<template>
	<div>
		<empty-ticker-widget style="height: 345px;" :meta="{ tickerId, name: 'Analyst Ratings' }" />
	</div>
</template>
