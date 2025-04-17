<script setup lang="ts">
import { reactive } from 'vue';

import { RcmDashboard, RcmDriver, RcmSwitch, RcmCheckbox } from '../../rcm';
import type { IRcmPositions } from '../../rcm/model';
import { usePriceStore } from '../stores';

interface IProps {
	positions: IRcmPositions;
}

defineProps<IProps>();

const priceStore = usePriceStore();

const select = reactive({
	favorites: false,
});
</script>

<template>
	<rcm-dashboard :positions="positions">
		<template #title> Additional features </template>
		<template #content>
			<rcm-switch
				:model-value="priceStore.isShowChart"
				@update:model-value="priceStore.toggleShowChart"
			>
				Chart
			</rcm-switch>
			<rcm-switch
				:model-value="priceStore.isShowPercentageChange"
				@update:model-value="priceStore.toggleShowPercentageChange"
			>
				Change, %
			</rcm-switch>
			<rcm-switch
				:model-value="priceStore.isShowLogo"
				@update:model-value="priceStore.toggleShowLogo"
			>
				Logo
			</rcm-switch>

			<rcm-checkbox v-model="select.favorites">Only favorites</rcm-checkbox>

			<rcm-driver />

			<rcm-checkbox
				:model-value="priceStore.isShowTicker"
				@update:model-value="priceStore.toggleShowTicker"
			>
				Ticker
			</rcm-checkbox>

			<rcm-checkbox
				:model-value="priceStore.isShowDescription"
				@update:model-value="priceStore.toggleShowDescription"
			>
				Description
			</rcm-checkbox>
		</template>
	</rcm-dashboard>
</template>
