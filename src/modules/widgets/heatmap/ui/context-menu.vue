<script setup lang="ts">
import { ChangeDisplay } from '@/modules/treemap';
import { ModalSubmenu, WidgetContextMenu } from '@/modules/widgets/base';
import type { ISettings, ISingleSetting, TitleViewVariant } from '../model';

interface IProps {
	activeDisplayValue: ISettings;
	title: string;
}

const props = defineProps<IProps>();

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'reset'): void;
}>();

const displayValue = defineModel<ISingleSetting>('displayValue', { required: true });
const isShowLogo = defineModel<boolean>('isShowLogo', { required: true });
const titleVariant = defineModel<TitleViewVariant>('titleVariant', { required: true });
</script>

<template>
	<widget-context-menu
		:title="props.title"
		@delete="emit('delete')"
		@reset="emit('reset')"
	>
		<modal-submenu>
			<template #title>Filter</template>
			<template #content>
				<change-display
					v-model:display-value="displayValue"
					v-model:is-show-logo="isShowLogo"
					v-model:title="titleVariant"
					:active-display-value="props.activeDisplayValue"
				/>
			</template>
		</modal-submenu>
	</widget-context-menu>
</template>
