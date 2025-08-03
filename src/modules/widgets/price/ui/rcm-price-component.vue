<script setup lang="ts">
import { reactive } from 'vue';

import { usePriceStore } from '../stores';
import { UiDriver } from '@/shared/ui/driver';
import { ModalItemSwitch, ModalItemCheckbox, ModalSubmenuContent } from '../../base';

const priceStore = usePriceStore();

const select = reactive({
	favorites: false,
});
</script>

<template>
	<modal-submenu-content>
		<template #content>
			<modal-item-switch
				:model-value="priceStore.isShowChart"
				@update:model-value="priceStore.toggleShowChart"
			>
				Chart
			</modal-item-switch>
			<modal-item-switch
				:model-value="priceStore.isShowPercentageChange"
				@update:model-value="priceStore.toggleShowPercentageChange"
			>
				Change, %
			</modal-item-switch>
			<modal-item-switch
				:model-value="priceStore.isShowLogo"
				@update:model-value="priceStore.toggleShowLogo"
			>
				Logo
			</modal-item-switch>

			<modal-item-checkbox v-model="select.favorites"> Only favorites </modal-item-checkbox>

			<ui-driver />

			<modal-item-checkbox
				:model-value="priceStore.isShowTicker"
				@update:model-value="priceStore.toggleShowTicker"
			>
				Ticker
			</modal-item-checkbox>

			<modal-item-checkbox
				:model-value="priceStore.isShowDescription"
				@update:model-value="priceStore.toggleShowDescription"
			>
				Description
			</modal-item-checkbox>
		</template>
	</modal-submenu-content>
</template>
