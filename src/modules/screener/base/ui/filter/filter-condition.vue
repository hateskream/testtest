<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { ModalFilter, ModalItemInteraction } from '@/modules/widgets/base';
import type { IFilterPreset, IFilterState } from '@/modules/screener/base';
import { UiPosition } from '@/shared/ui/position';

import FilterRadioGroup from './filter-radio-group.vue';

const modelValue = defineModel<IFilterState>();

defineProps<{
	presets: IFilterPreset[];
	manualSetup?: boolean;
	required?: boolean;
	keyNumbers?: boolean;
}>();

// TODO: Manual Setup handling
</script>

<template>
	<filter-radio-group
		v-model="modelValue"
		:presets
		:required
		:key-numbers
	>
		<template #footer-actions v-if="manualSetup">
			<ui-position
				:teleport="false"
			>
				<template #title>
					<modal-item-interaction>
						<div :class="classes.interactionLabel">
							<ui-icon
								:id="IconIds.Settings"
								width="16"
								height="16"
								:class="classes.interactionIcon"
							/>
							<span>Manual Setup</span>
						</div>
					</modal-item-interaction>
				</template>
				<template #content>
					<modal-filter>
						<template #title>
							Manual Setup
						</template>
						<template #content>
						</template>
					</modal-filter>
				</template>
			</ui-position>
		</template>
	</filter-radio-group>
</template>

<style module="classes">
.interactionLabel {
	display: flex;
	gap: 6px;
	align-items: center;
}

.interactionIcon {
	color: var(--icon-color-base-300);
}
</style>
