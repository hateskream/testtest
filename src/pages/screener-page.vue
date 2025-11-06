<script setup lang="ts">
import { computed } from 'vue';

import { LayoutComponent } from '@/modules/layout';
import { ScreenerComponent, ScreenerTabsComponent, ScreenerType } from '@/modules/screener/base';
import { UiSearch } from '@/shared/ui/input';
import { RouteScreenerType } from '@/types/route.d';

interface IScreenerPageProps {
	type: RouteScreenerType;
}

const props = defineProps<IScreenerPageProps>();

const routeTypeToScreenerTypeMap: Record<RouteScreenerType, ScreenerType> = {
	[RouteScreenerType.STOCK]: ScreenerType.Stock,
	[RouteScreenerType.CRYPTO]: ScreenerType.Crypto,
	[RouteScreenerType.CEX]: ScreenerType.CEX,
	[RouteScreenerType.ETF]: ScreenerType.ETF,
	[RouteScreenerType.DEX]: ScreenerType.DEX,
	[RouteScreenerType.BOND]: ScreenerType.Bond,
};

const screenerTypeToLabel: Record<ScreenerType, string> = {
	[ScreenerType.Stock]: 'Stock Screener',
	[ScreenerType.Crypto]: 'Crypto Screener',
	[ScreenerType.CEX]: 'CEX Screener',
	[ScreenerType.ETF]: 'ETF Screener',
	[ScreenerType.DEX]: 'DEX Screener',
	[ScreenerType.Bond]: 'Bond Screener',
};

const screenerType = computed(() => routeTypeToScreenerTypeMap[props.type]);
const screenerTypeLabel = computed(() => screenerTypeToLabel[screenerType.value]);
</script>

<template>
	<layout-component :is-curtain-fixed="false">
		<template #header>
			<div :class="classes.header">
				<ui-search
					:class="classes.search"
					placeholder="Search APPL, S&P 500..."
				/>
				<screener-tabs-component :class="classes.tabs"  />
			</div>
		</template>
		<template #content>
			<div :class="classes.root">
				<h2 :class="classes.title">{{screenerTypeLabel}}</h2>
				<screener-component :type="screenerType" />
			</div>
		</template>
	</layout-component>
</template>

<style module="classes">
.header {
	position: relative;
}

.tabs {
	position: absolute;
	top: 0;
	display: flex;
	justify-content: center;
	width: 100%;
}

.search {
	width: 300px;
	padding: 12px;
	border: 1px solid var(--border-color-surface-02);
	border-radius: 9999px;
}

.root {
	display: flex;
	flex-direction: column;
	max-width: 100%;
}

.title {
	margin: 16px 0;
}
</style>
