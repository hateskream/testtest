<script setup lang="ts">
import type { Sectors } from '../../../model';
import type { ITickerWidgetMeta } from '@/modules/ticker';

import BaseSectors
	from './base-sectors.vue';


interface IProps {
	data: Sectors;
	meta: ITickerWidgetMeta;
}

const props = defineProps<IProps>();


</script>

<template>
	<base-sectors :data="props.data" :meta="props.meta" />
</template>

<style module="classes">

</style>
