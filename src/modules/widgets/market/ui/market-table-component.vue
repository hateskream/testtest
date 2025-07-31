<script setup lang="ts">
import { computed } from 'vue';

import { adaptMarketColumnsToGeneric, adaptMarketDataToGeneric } from '../utils';
import { useMarketStore } from '../stores';
import type { IMarketDomain } from '../api';

import WidgetTypedTable from '@/modules/widgets/widget-table/widget-typed-table.vue';

interface IViewComponentProps {
	markets: IMarketDomain[];
}

const props = defineProps<IViewComponentProps>();
const marketStore = useMarketStore();

const genericColumns = computed(() =>
	adaptMarketColumnsToGeneric(marketStore.activeTableColumns),
);

const genericRows = computed(() =>
	adaptMarketDataToGeneric(props.markets, marketStore.activeTableColumns),
);
</script>

<template>
	<div :class="classes.scrollable">

		<widget-typed-table
			:columns="genericColumns"
			:rows="genericRows"
			:enable-drag-drop="true"
			:enable-column-reordering="true"
			:enable-sorting="false"
			:enable-column-settings="true"
			:sticky-header="true"
			:sticky-first-column="true"
			:enable-row-actions="true"
			:show-header="true"
		/>
	</div>
</template>

<style module="classes">
.scrollable {
	position: relative;
	height: 100%;
}
</style>
