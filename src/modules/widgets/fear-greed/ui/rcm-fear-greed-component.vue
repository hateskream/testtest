<script setup lang="ts">
import { ModalItemSwitch, ModalSubmenuContent } from '../../base';

interface ISettingsModel {
	isShowChart: boolean;
	isShowName: boolean;
	isShowDescription: boolean;
	isShowPastValues: boolean;
}

const settings = defineModel<ISettingsModel>({ required: true });

function toggleShowChart() {
	settings.value.isShowChart = !settings.value.isShowChart;
}

function toggleShowName() {
	settings.value.isShowName = !settings.value.isShowName;
}

function toggleShowPastValues() {
	settings.value.isShowPastValues = !settings.value.isShowPastValues;
}

function toggleShowDescription() {
	settings.value.isShowDescription = !settings.value.isShowDescription;
}
</script>

<template>
	<modal-submenu-content>
		<template #title> Additional features </template>
		<template #content>
			<modal-item-switch
				:model-value="settings.isShowChart"
				@update:model-value="toggleShowChart"
			>
				Chart
			</modal-item-switch>
			<modal-item-switch
				:model-value="settings.isShowName"
				@update:model-value="toggleShowName"
			>
				Name
			</modal-item-switch>
			<modal-item-switch
				:model-value="settings.isShowDescription"
				@update:model-value="toggleShowDescription"
			>
				Description
			</modal-item-switch>
			<modal-item-switch
				:model-value="settings.isShowPastValues"
				@update:model-value="toggleShowPastValues"
			>
				Past values
			</modal-item-switch>
		</template>
	</modal-submenu-content>
</template>
