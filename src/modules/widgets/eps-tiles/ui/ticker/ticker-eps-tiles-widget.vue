<script setup lang="ts">
import type { ITickerWidgetMeta } from '@/modules/ticker';
import { useQueryEpsTiles } from '../../queries';

import TickerEpsTilesWidgetLoader from './ticker-eps-tiles-widget-loader.vue';
import TickerEpsTilesWidgetError from './ticker-eps-tiles-widget-error.vue';
import EpsTilesCard from '../common/eps-tiles-card.vue';

interface ITickerEpsTilesWidgetProps {
	meta: ITickerWidgetMeta;
}

const props = defineProps<ITickerEpsTilesWidgetProps>();

const {
	data,
	isLoading,
	isError,
	refetch,
} = useQueryEpsTiles(() => props.meta.tickerId);
</script>

<template>
	<ticker-eps-tiles-widget-loader v-if="isLoading" />

	<ticker-eps-tiles-widget-error
		v-else-if="isError"
		@retry="refetch"
	/>

	<template v-else-if="data">
		<div :class="classes.content">
			<div :class="classes.grid">
				<eps-tiles-card
					v-for="item in data.items"
					:key="item.quarter"
					:item="item"
					:class="classes.card"
				/>
			</div>
		</div>
	</template>
</template>

<style module="classes">
.grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: var(--padding-s4, 6px);
	width: 100%;
	container-type: inline-size;
}

/* (220px * 2) + 6 */
@container (max-width: 446px) {
	.grid {
		grid-template-rows: repeat(4, 1fr);
		grid-template-columns: 1fr;
	}
}
</style>
