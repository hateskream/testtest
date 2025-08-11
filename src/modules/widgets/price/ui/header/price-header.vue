<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import {
	ModalBadge,
	ModalBadgeList,
	ModalItemSelector,
} from '@/modules/widgets/base';
import { getAllMarkets, getMarketLabel, type MarketType } from '../../model';

const activeMarket = defineModel<MarketType>({ required: true });

function updateMarket(market: MarketType) {
	activeMarket.value = market;
}
</script>

<template>
	<div :class="classes.performanceHeader">
		<modal-badge>
			<template #title>
				{{ getMarketLabel(activeMarket) }}
				<ui-icon :id="IconIds.DropdownDown" :class="classes.icon" />
			</template>

			<template #content>
				<modal-badge-list>
					<template #title>Stock</template>

					<template v-for="market in getAllMarkets()" :key="market.type">
						<modal-item-selector
							:model-value="activeMarket === market.type"
							@update:model-value="updateMarket(market.type)"
						>
							{{ market.label }}
						</modal-item-selector>
					</template>
				</modal-badge-list>
			</template>
		</modal-badge>
	</div>
</template>

<style module="classes">
.listFiltersTitle {
	text-transform: capitalize;
}

.performanceHeader {
	margin-inline: 12px;
}

.listFiltersTitleImageWrapper {
	display: flex;
}

.listFiltersTitleImage {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 28px;
	height: 28px;
	margin-left: -12px;
	overflow: hidden;
	background-color: #222223;
	border: 2px solid #222223;
	border-radius: 100%;
}

.listFiltersTitleImageWrapper > .listFiltersTitleImage:first-child {
	margin-left: 0;
}
</style>
