<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import {
	ModalBadge,
	ModalBadgeList,
	ModalItemSelector,
} from '@/modules/widgets/base';
import { usePriceStore } from '@/modules/widgets/price/stores';


const performanceStore = usePriceStore();
</script>

<template>
	<div :class="classes.performanceHeader">
		<modal-badge>
			<template #title>
				{{ performanceStore.activeMarket.name }}
				<ui-icon :id="IconIds.DropdownDown" :class="classes.icon" />
			</template>

			<template #content>
				<modal-badge-list>
					<template #title>Stock</template>

					<template v-for="market in performanceStore.markets" :key="market.value">
						<modal-item-selector
							:model-value="performanceStore.activeMarket.value === market.value"
							@update:model-value="performanceStore.setActiveMarket(market)"
						>
							{{ market.name }}
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
