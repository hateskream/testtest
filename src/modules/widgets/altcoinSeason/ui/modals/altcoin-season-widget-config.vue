<script setup lang="ts">
import { computed } from 'vue';

import { ModalItemSwitch, ModalBadgeList } from '@/modules/widgets/base/modal';
import { useAltcoinSeasonStore } from '@/modules/widgets/altcoinSeason/stores';
import { ALTCOIN_SEASON_MODULE_LABELS, type AltcoinSeasonModuleKey } from '@/modules/widgets/altcoinSeason/model';

const altcoinSeasonStore = useAltcoinSeasonStore();

const modules = computed(() => altcoinSeasonStore.modules);
const isSaving = computed(() => altcoinSeasonStore.isSaving);
// const saveError = computed(() => altcoinSeasonStore.saveError);

async function handleModuleToggle(moduleKey: string, value: boolean) {
	try {
		await altcoinSeasonStore.setModuleState(moduleKey as AltcoinSeasonModuleKey, value);
	} catch (_error) {
		// error already handled in store
		// console.error('Failed to update module state:', error);
	}
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
			v-for="(value, key) in modules"
			:key="key"
			:model-value="value"
			:disabled="isSaving"
			@update:model-value="(newValue) => handleModuleToggle(key, newValue)"
		>
			{{ ALTCOIN_SEASON_MODULE_LABELS[key as AltcoinSeasonModuleKey] || key }}
		</modal-item-switch>
	</modal-badge-list>
</template>

<style module="classes">
</style>
