<script setup lang="ts">
import { computed, useCssModule } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { ModalItem } from '../index';

interface IProps {
	modelValue: boolean;
}

interface IEmits {
	(e: 'update:modelValue', data: boolean): void;
}

const props = defineProps<IProps>();

const emits = defineEmits<IEmits>();

const classes = useCssModule('classes');

const classesList = computed(() => ({
	[classes.icon]: true,
	[classes.iconActive]: props.modelValue,
}));
</script>

<template>
	<modal-item
		:class="classes.content"
		@click="emits('update:modelValue', !modelValue)"
	>
		<slot name="default" />

		<div :class="classesList">
			<ui-icon
				v-if="modelValue"
				:id="IconIds.RcmCheckbox"
			/>
		</div>
	</modal-item>
</template>

<style module="classes">
.icon {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 18px;
	height: 18px;
	padding: 4px;
	color: var(--icon-color-base-500);
	border-width: 1px;
	border-style: solid;
	border-color: var(--bg-modal-color-base);
	border-radius: 6px;
}

.iconActive {
	background-color: rgb(115 115 116);
	border-color: rgb(115 115 116);
}

.content:hover .icon {
	border-color: rgb(115 115 116);
}

.content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
}
</style>
