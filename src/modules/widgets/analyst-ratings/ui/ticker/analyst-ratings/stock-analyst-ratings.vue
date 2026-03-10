<script setup lang="ts">
import type { AnalystRatings } from '../../../model';
import type { ITickerWidgetMeta } from '@/modules/ticker';

import BaseAnalystRatings from './base-analyst-ratings.vue';

interface IProps {
	data: AnalystRatings;
	meta: ITickerWidgetMeta;
}

const props = defineProps<IProps>();
</script>

<template>
	<base-analyst-ratings :data="props.data" :meta="props.meta" />
</template>
