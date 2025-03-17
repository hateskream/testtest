<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { FearGreedDashboard } from '../../dashboards/fear-greed';
import { MarketDashboard } from '../../dashboards/market';
import { MarketCapDashboard } from '../../dashboards/market-cap';
import { NewsDashboard } from '../../dashboards/news';
import { PriceDashboard } from '../../dashboards/price';
import { useDashboardsStore } from '../stores';
import { DashboardType } from '../model';

const { activeGroup } = storeToRefs(useDashboardsStore());

function getDashboardComponent(type: DashboardType) {
	const components = {
		[DashboardType.FearGreed]: FearGreedDashboard,
		[DashboardType.Market]: MarketDashboard,
		[DashboardType.MarketCap]: MarketCapDashboard,
		[DashboardType.News]: NewsDashboard,
		[DashboardType.Price]: PriceDashboard,
	};
	return components[type];
}
</script>

<template>
	<div :class="classes.dashboardsContainer">
		<div
			v-if="activeGroup"
			:class="classes.dashboardGrid"
		>
			<component
				:is="getDashboardComponent(dashboard.type)"
				v-for="dashboard in activeGroup.dashboards"
				:key="dashboard.id"
				:dashboard="dashboard"
			/>
		</div>
	</div>
</template>

<style module="classes">
.dashboardsContainer {
	padding: 20px;
	border: 1px solid #eeeeee;
}

.dashboardGrid {
	display: grid;
	gap: 20px;
	margin-bottom: 20px;
}
</style>
