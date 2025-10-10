<script setup lang="ts">
import { UiDriver } from '@/shared/ui/driver';
import { ModalItemSelector, ModalItemSwitch, ModalSubmenuContent } from '../../base';
import type { IDisplaySettings } from '../model';

const settings = defineModel<IDisplaySettings>({ required: true });

function toggleShowChart() {
	settings.value = { ...settings.value, isShowChart: !settings.value.isShowChart };
}

function toggleShowPercentageChange() {
	settings.value = {
		...settings.value,
		isShowPercentageChange: !settings.value.isShowPercentageChange,
	};
}

function toggleShowLogo() {
	settings.value = {
		...settings.value,
		isShowLogo: !settings.value.isShowLogo,
	};
}

function changeTextDisplay() {
	const isShowTicker = !settings.value.isShowTicker;
	const isShowDescription = !settings.value.isShowDescription;

	settings.value = {
		...settings.value,
		isShowTicker,
		isShowDescription,
	};
}
</script>

<template>
	<modal-submenu-content>
		<template #content>
			<modal-item-switch
				:model-value="settings.isShowChart"
				@update:model-value="toggleShowChart"
			>
				Chart
			</modal-item-switch>
			<modal-item-switch
				:model-value="settings.isShowPercentageChange"
				@update:model-value="toggleShowPercentageChange"
			>
				Change, %
			</modal-item-switch>
			<modal-item-switch
				:model-value="settings.isShowLogo"
				@update:model-value="toggleShowLogo"
			>
				Logo
			</modal-item-switch>

			<ui-driver />

			<modal-item-selector
				:model-value="settings.isShowTicker"
				@update:model-value="changeTextDisplay"
			>
				Ticker
			</modal-item-selector>

			<modal-item-selector
				:model-value="settings.isShowDescription"
				@update:model-value="changeTextDisplay"
			>
				Description
			</modal-item-selector>
		</template>
	</modal-submenu-content>
</template>
