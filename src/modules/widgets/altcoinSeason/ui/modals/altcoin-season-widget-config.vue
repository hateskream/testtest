<script setup lang="ts">
import { ModalBadgeList, ModalItemSwitch } from '@/modules/widgets/base/modal';
import {
	ALTCOIN_SEASON_MODULE_LABELS,
	type AltcoinSeasonModuleKey,
	type IAltcoinSeasonConfig,
} from '@/modules/widgets/altcoinSeason/model';

const props = defineProps<{
	modules: IAltcoinSeasonConfig['modules'];
}>();

const selectedModules = defineModel<IAltcoinSeasonConfig['modules']>('selected-modules', { required: true });

function handleModuleToggle(key: AltcoinSeasonModuleKey, value: boolean) {
	selectedModules.value[key] = value;
}
</script>

<template>
	<modal-badge-list>
		<template #title>
			Filter
			<!-- TODO: Обсудить с дизайнерами -->
			<!-- Maybe good to show saving and error indicator for optomistic update -->
			<!-- <span v-if="isSaving" :class="classes.savingIndicator">Saving...</span> -->
		</template>

		<modal-item-switch
			v-for="(value, key) in props.modules"
			:key="key"
			:model-value="value"
			@update:model-value="(newValue) => handleModuleToggle(key, newValue)"
		>
			{{ ALTCOIN_SEASON_MODULE_LABELS[key] || key }}
		</modal-item-switch>
	</modal-badge-list>
</template>

<style module="classes">
</style>
