<script setup lang="ts">
import {
	ModalItemSelector,
	ModalBadgeList,
	ModalItemInteraction,
	ModalItemCheckbox,
} from '@/modules/widgets/base';
import type {
	ISingleSetting,
	ISettings,
} from '../model';
import { TitleViewVariant } from '../model';
import { UiPosition } from '@/shared/ui/position';

import InteractionSettings from './interaction-settings.vue';

interface IProps {
	activeDisplayValue: ISettings;
}

const props = defineProps<IProps>();

const displayValue = defineModel<ISingleSetting>('displayValue', { required: true });
const isShowLogo = defineModel<boolean>('isShowLogo', { required: true });
const title = defineModel<TitleViewVariant>('title', { required: true });

function updateTitle(newTitle: TitleViewVariant) {
	title.value = newTitle;
}
</script>

<template>
	<modal-badge-list>
		<modal-item-checkbox
			v-model="isShowLogo"
		>
			Logo
		</modal-item-checkbox>
		<ui-position>
			<template #title>
				<modal-item-interaction>
					<div>
						Title : {{ title }}
					</div>
				</modal-item-interaction>
			</template>
			<template #content>
				<modal-badge-list>
					<template #default>
						<modal-item-selector
							v-for="t in TitleViewVariant"
							:key="t"
							:model-value="t === title"
							@update:model-value="updateTitle(t)"
						>
							{{ t }}
						</modal-item-selector>
					</template>
				</modal-badge-list>
			</template>
		</ui-position>
		<interaction-settings
			v-model="displayValue"
			:active="props.activeDisplayValue"
			title="Display value"
		/>
	</modal-badge-list>
</template>
