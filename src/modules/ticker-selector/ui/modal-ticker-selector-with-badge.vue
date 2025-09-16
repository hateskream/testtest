<script setup lang="ts">
import { computed } from 'vue';

import { ModalFilter } from './components/modal';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { useQueryTickerSelector } from '../queries';
import type { ITickerEmits } from '../model';
import { ACTIVE_TICKER_LIST_COUNT_SHOW } from '../const';
import { getMappedRow } from '../utils';
import { ModalBadge } from '@/modules/widgets/base';

import ModalFilterTickerIcon from './components/modal/modal-filter-ticker-icon.vue';

const { data } = useQueryTickerSelector();

const selectedTickers = defineModel<string[]>({
	default: [],
});

const emits = defineEmits<ITickerEmits>();


const selectedTickersMapped = computed(() => {
	return (data.value?.tickers ?? [])
		.filter((item) => selectedTickers.value.includes(item.tickerId))
		.slice(0, ACTIVE_TICKER_LIST_COUNT_SHOW)
		.map(getMappedRow);
});

</script>

<template>
	<modal-badge>
		<template #title>
			<div
				v-if="selectedTickersMapped.length > 0"
				:class="classes.iconsWrapper"
			>
				<div
					v-for="item in selectedTickersMapped"
					:key="item.tickerId"
					:class="classes.iconsItem"
				>
					<modal-filter-ticker-icon
						:size="14"
						:ticker="item.ticker"
						:src-image="item.srcImage"
						:type="item.symbolType"
					/>
				</div>

				<template v-if="selectedTickers.length > 3">
					+ {{ selectedTickers.length }}
				</template>
			</div>


			<div
				v-if="selectedTickers.length === 0"
				:class="classes.title"
			>
				Crypto
			</div>

			<ui-icon
				:id="IconIds.DropdownDown"
				width="12"
				height="12"
			/>
		</template>

		<template #content>
			<modal-filter
				v-if="data"
				v-model="selectedTickers"
				:tickers="data.tickers"
				@select="emits('select', $event)"
				@unselect="emits('unselect', $event)"
				@select-all="emits('selectAll', $event)"
			/>
		</template>
	</modal-badge>
</template>

<style module="classes">
.iconsItem {
	margin-left: -12px;
	overflow: hidden;
	background-color: #222223;
	border-radius: 100%;
}

.iconsItem:first-child {
	margin-left: 0;
}

.iconsWrapper {
	display: flex;
	align-items: center;
	overflow: hidden;
	gap: 4px;
}
</style>
