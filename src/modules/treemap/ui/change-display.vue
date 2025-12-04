<script setup lang="ts">
import { ModalBadgeList, ModalItemCheckbox, ModalItemSelector, ModalSubmenu } from '@/modules/widgets/base';
import type { ISettings, ISingleSetting } from '../model';
import { TitleViewVariant } from '../model';

import InteractionSettings from './interaction-settings.vue';

interface IProps {
	activeDisplayValue: ISettings;
	displayVariant: 'default' | 'new';
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
	<modal-item-checkbox
		v-model="isShowLogo"
	>
		Logo
	</modal-item-checkbox>
	<modal-submenu>
		<template #title>
			Title : {{ title }}
		</template>
		<template #content>
			<modal-badge-list :display-variant>
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
	</modal-submenu>
	<interaction-settings
		v-model="displayValue"
		:active="props.activeDisplayValue"
		title="Display value"
		:display-variant
	/>
</template>
