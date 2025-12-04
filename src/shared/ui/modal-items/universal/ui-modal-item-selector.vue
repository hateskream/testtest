<script setup lang="ts">
import { computed, useCssModule } from 'vue';

import { useDisplayVariant } from '@/shared/ui/modal';

import UiModalItem from './ui-modal-item.vue';

const props = defineProps<{
	displayVariant?: 'default' | 'new';
}>();

const model = defineModel<boolean>({
	required: true,
});

const { displayVariant } = useDisplayVariant(() => props.displayVariant);

const classes = useCssModule('classes');

const classesList = computed(() => ({
	[classes.icon]: true,
	[classes.new]: displayVariant.value === 'new',
	[classes.iconActive]: model.value,
}));
</script>

<template>
	<ui-modal-item
		:class="classes.content"
		:display-variant
		@click="model = !model"
	>
		<slot name="default" />

		<div :class="classesList" />
	</ui-modal-item>
</template>

<style module="classes">
.icon {
	flex-shrink: 0;
	width: 20px;
	height: 20px;
	color: var(--icon-color-base-500);
	border-width: 1px;
	border-style: solid;
	border-color: var(--bg-modal-color-base);
	border-radius: 100px;
}

.new {
	border-color: var(--atom-contrast-50, rgb(255 255 255 / 50%));
	opacity: 0.4;
}

.content:hover .icon {
	border-width: 1px;
	border-color: var(--border-color-base-500);
}

.iconActive {
	box-sizing: border-box;
	border-width: 6px !important;
	border-color: rgb(245 245 245 / 90%);
	opacity: 1;
}

.content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
	user-select: none;
}
</style>
