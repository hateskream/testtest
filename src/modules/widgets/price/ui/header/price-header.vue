<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import {
	ModalBadge,
	ModalBadgeList,
	ModalItemSelector,
} from '@/modules/widgets/base';
import { usePriceStore } from '@/modules/widgets/price/stores';


const performanceStore = usePriceStore();
const { setActiveMarket } = performanceStore;
const { activeMarket, markets } = storeToRefs(performanceStore);

const currentFilterTypeLabel = computed(() => {
	return activeMarket.value.name;
});


</script>

<template>
	<div :class="classes.performanceHeader">
		<div :class="classes.listFilters">
			<modal-badge>
				<template #title>
					{{ currentFilterTypeLabel }}
					<ui-icon :id="IconIds.DropdownDown" :class="classes.icon" />
				</template>

				<template #content>
					<modal-badge-list>
						<template #title>Stock</template>

						<template v-for="market in markets" :key="market.value">
							<modal-item-selector
								:model-value="activeMarket.value === market.value"
								@update:model-value="setActiveMarket(market)"
							>
								{{ market.name }}
							</modal-item-selector>
						</template>
					</modal-badge-list>
				</template>
			</modal-badge>


		</div>

	</div>
</template>

<style module="classes">
.performanceHeader {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 10px 0 16px;
	border-bottom: 1px solid var(--border-color-base-100);
	gap: 6px;
}

.listFilters {
	display: flex;
	align-items: center;
	max-width: 100%;
	overflow-x: auto;
	gap: 6px;
}

.iconAllFilter {
	cursor: pointer;
}

.icon {
	color: var(--icon-color-base-300);
}
</style>
