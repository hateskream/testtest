<script setup lang="ts">
import { ModalItemSwitch } from '@/modules/widgets/base/modal';
import {
	ALTCOIN_SEASON_MODULE_LABELS,
	type AltcoinSeasonModuleKey,
	type IAltcoinSeasonConfig,
} from '@/modules/widgets/altcoinSeason/model';

const selectedModules = defineModel<IAltcoinSeasonConfig['modules']>('selectedModules', { required: true });

function handleModuleToggle(key: AltcoinSeasonModuleKey, value: boolean) {
	selectedModules.value[key] = value;
}
</script>

<template>
	<modal-item-switch
		v-for="(value, key) in selectedModules"
		:key="key"
		:model-value="value"
		@update:model-value="(newValue) => handleModuleToggle(key, newValue)"
	>
		{{ ALTCOIN_SEASON_MODULE_LABELS[key] || key }}
	</modal-item-switch>
</template>

<style module="classes">
</style>
