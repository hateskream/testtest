<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { ModalItemInteraction } from '@/modules/widgets/base';
import { UiSubposition } from '@/shared/ui/position';
import { UiModalWrapper, UiModalContent, UiModalTitle } from '@/shared/ui/modal';
import type { IFilterPreset, IFilterState } from '../../model';

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
			<ui-subposition
				:trigger="['hover', 'click']"
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
					<ui-modal-wrapper display-variant="new">
						<ui-modal-title>
							Manual Setup
						</ui-modal-title>
						<ui-modal-content>
							Manual Setup Handling
						</ui-modal-content>
					</ui-modal-wrapper>
				</template>
			</ui-subposition>
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
