<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { BaseSearch } from '../..';

interface ISearchComponentProps {
	modelValue: string;
}

defineProps<ISearchComponentProps>();

interface ISearchComponentEmits {
	(e: 'update:modelValue', data: string): void;
}

const emits = defineEmits<ISearchComponentEmits>();
</script>

<template>
	<div :class="classes.container">
		<ui-icon
			:id="IconIds.Search"
			width="24"
			height="24"
			:class="classes.icon"
		/>

		<base-search
			:model-value="modelValue"
			@update:model-value="emits('update:modelValue', $event)"
		/>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	align-items: center;
	min-width: 253px;
	height: 48px;
	border-bottom: 1px solid rgb(255 255 255 / 12%);
	gap: 6px;
}

.icon {
	color: var(--icon-color-base-300);
}
</style>
