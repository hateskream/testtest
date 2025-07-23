<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import {
	ModalBadge,
	ModalBadgeList,
	ModalFilterTicker,
	ModalItemSelector,
} from '@/modules/widgets/base';
import { usePriceStore } from '@/modules/widgets/price/stores';
import type { IModalFilterTicker } from '@/modules/widgets/base/modal/model';
import type { ICurrency } from '../../model';
import { compareStrings } from '@/shared/lib';
import type { IMeta } from '@/modules/dashboard-group/core';

import TickerIcon from '@/shared/ui/ticker/ticker-icon.vue';


interface IViewComponentProps {
	currencies: ICurrency[];
	meta: IMeta;
}

const props = defineProps<IViewComponentProps>();

const performanceStore = usePriceStore();

const ACTIVE_TICKER_LIST_COUNT_SHOW = 3;

const listWithGroups = ref<IModalFilterTicker[]>(
	[],
);

watch(() => props.currencies, () => {
	listWithGroups.value = props.currencies.map((item) => {
		const isSelected = compareStrings(performanceStore.activeCurrency?.name ?? '', item.name);

		return {
			id: item.id,
			image: Array.isArray(item.srcImage) ? item.srcImage[0] : item.srcImage,
			name: item.name,
			ticker: item.ticker,
			imageType: 'image',
			type: {
				value: item.market,
				name: item.market,
			},
			isSelected: isSelected,
		};
	});
}, {
	immediate: true,
});

const activeList = computed<IModalFilterTicker[]>(() => {
	return Object.values(listWithGroups.value).flat().filter(item => item.isSelected);
});

function handleUpdateFilterTickerItem(item: IModalFilterTicker) {
	if (item.isSelected) {
		performanceStore.setActiveCurrency(
			props.currencies.find((singleItem) => compareStrings(singleItem.id, item.id))!,
		);

		if (performanceStore.activeMarket.value !== item.type.value) {
			performanceStore.setActiveMarket(
				performanceStore.markets.find((market) => compareStrings(market.value, item.type.value))!,
			);
		}
	} else {
		performanceStore.setActiveCurrency(null);
	}
}
</script>

<template>
	<div :class="classes.performanceHeader">
		<modal-badge v-if="meta.size.w >=3 && meta.size.h>=8">
			<template #title>
				<div :class="classes.listFiltersTitleImageWrapper">
					<div
						v-for="item in activeList.slice(0, ACTIVE_TICKER_LIST_COUNT_SHOW)"
						:key="item.ticker"
						:class="classes.listFiltersTitleImage"
					>
						<ticker-icon
							:src="item.image"
							:ticker="item.ticker"
							:size="14"
							:class="classes.listFiltersTitleImageBadge"
						/>
					</div>
				</div>


				<div
					v-if="
						activeList.length  === 0
					"
					:class="classes.listFiltersTitle"
				>
					{{ performanceStore.activeMarket.value }}
				</div>

				<ui-icon
					:id="IconIds.DropdownDown"
					width="12"
					height="12"
					:class="classes.icon"
				/>
			</template>

			<template #content>
				<modal-filter-ticker
					v-model="listWithGroups"
					:is-multi-select="false"
					@select="handleUpdateFilterTickerItem"
				/>
			</template>
		</modal-badge>
		<modal-badge v-else>
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
