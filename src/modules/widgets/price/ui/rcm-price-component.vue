<script setup lang="ts">
import { UiDriver } from '@/shared/ui/driver';
import { ModalItemSwitch, ModalItemCheckbox, ModalSubmenuContent } from '../../base';
import type { ISettings } from '../model';

const settings = defineModel<ISettings>({ required: true });

function toggleShowChart() {
	settings.value.isShowChart = !settings.value.isShowChart;
}

function toggleShowPercentageChange() {
	settings.value.isShowPercentageChange = !settings.value.isShowPercentageChange;
}

function toggleShowLogo() {
	settings.value.isShowLogo = !settings.value.isShowLogo;
}

function changeTextDisplay() {
	settings.value.isShowTicker = !settings.value.isShowTicker;
	settings.value.isShowDescription = !settings.value.isShowDescription;
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

			<modal-item-checkbox
				:model-value="settings.isShowTicker"
				@update:model-value="changeTextDisplay"
			>
				Ticker
			</modal-item-checkbox>

			<modal-item-checkbox
				:model-value="settings.isShowDescription"
				@update:model-value="changeTextDisplay"
			>
				Description
			</modal-item-checkbox>
		</template>
	</modal-submenu-content>
</template>
