<script setup lang="ts">
import { computed, useCssModule } from 'vue';

import { useDisplayVariant } from '@/shared/ui/modal';
import { UiText } from '@/shared/ui/text';

import UiModalItem from './ui-modal-item.vue';

const props = defineProps<{
	number: string | number;
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
}));
</script>

<template>
	<ui-modal-item
		:class="[classes.content, {[classes.active]: model}]"
		:display-variant
		@click="model = !model"
	>
		<slot name="default" />

		<ui-text token="text-200-r" :class="classes.key">
			{{props.number}}
		</ui-text>

		<div :class="classesList" />
	</ui-modal-item>
</template>

<style module="classes">
.icon {
	display: none;
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
}

.content:hover .icon {
	border-width: 1px;
	border-color: var(--border-color-base-500);
}

.content.active .icon {
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

.key {
	display: grid;
	place-items: center;
	width: 20px;
	height: 20px;
	color: var(--text-100, rgb(255 255 255 / 30%));
}

.content:hover .key,
.content.active .key {
	display: none;
}

.content:hover .icon,
.content.active .icon {
	display: block;
}
</style>
