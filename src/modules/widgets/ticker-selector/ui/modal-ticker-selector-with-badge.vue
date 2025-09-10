<script setup lang="ts">
import { ModalFilter } from './components/modal';
import { useQueryTickerSelector } from '../queries';
import type { ITickerEmits, ITickerMapped } from '../model';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { ACTIVE_TICKER_LIST_COUNT_SHOW } from '../const';
import { ModalBadge } from '../../base';

import ModalFilterTickerIcon from './components/modal/modal-filter-ticker-icon.vue';

const { data } = useQueryTickerSelector();

const selectedTickers = defineModel<ITickerMapped[]>({
	default: [],
});

const emits = defineEmits<ITickerEmits>();
</script>

<template>
	<modal-badge>
		<template #title>
			<div
				:class="classes.iconsWrapper"
			>
				<div
					v-for="item in selectedTickers.slice(0, ACTIVE_TICKER_LIST_COUNT_SHOW)"
					:key="item.tickerId"
					:class="classes.iconsItem"
				>
					<modal-filter-ticker-icon
						:size="20"
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
	margin-left: -10px;
	overflow: hidden;
	gap: 4px;
}

.title {
	margin-left: 8px;
}
</style>
