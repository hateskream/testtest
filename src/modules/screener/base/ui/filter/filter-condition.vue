<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { ModalFilter, ModalItemInteraction } from '@/modules/widgets/base';
import type { IFilterPreset, IFilterState } from '../../model';
import { UiPosition } from '@/shared/ui/position';

import FilterRadioGroup from './filter-radio-group.vue';

const modelValue = defineModel<IFilterState>();

interface IFilterConditionProps {
	presets: IFilterPreset[];
	manualSetup?: boolean;
	required?: boolean;
	keyNumbers?: boolean;
}

const props = defineProps<IFilterConditionProps>();

// TODO: Manual Setup handling
</script>

<template>
	<filter-radio-group
		v-model="modelValue"
		:presets="props.presets"
		:required="props.required"
		:key-numbers="props.keyNumbers"
	>
		<template #footer-actions v-if="props.manualSetup">
			<ui-position
				:teleport="false"
				position="right-start"
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
							Manual Setup Handling
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
