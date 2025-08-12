<script setup lang="ts">
import type { TableRow } from '../model';

import MarketTabsComponent from './market-tabs-component.vue';
import MarketTableComponent from './market-table-component.vue';

interface IViewComponentProps {
	markets: TableRow[];
}

defineProps<IViewComponentProps>();
</script>

<template>
	<div :class="classes.root">
		<market-tabs-component />
		<market-table-component :markets="markets" />
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 0 16px 18px;
	overflow: hidden;
}
</style>
