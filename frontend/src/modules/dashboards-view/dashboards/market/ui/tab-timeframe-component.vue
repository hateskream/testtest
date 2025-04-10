<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { onClickOutside } from '@vueuse/core';

import { IconIds, UiIcon } from '@/shared/ui/icon';

interface IProps {
	modelValue: string;
}

defineProps<IProps>();

const emits = defineEmits<{
	(e: 'update:modelValue', data: string): void;
}>();

const timeframes = [
	{
		name: '1 hour',
		value: '1h',
	},
	{
		name: '24 hours',
		value: '24h',
	},
	{
		name: '7 days',
		value: '7d',
	},
	{
		name: '30 days',
		value: '30d',
	},
];

const isVisible = ref(false);

const timeframeRef = useTemplateRef('timeframe');

onClickOutside(timeframeRef, () => {
	isVisible.value = false;
});
</script>

<template>
	<div :class="classes.section">
		<div
			:class="classes.timeframe"
			@click.prevent.stop="isVisible = !isVisible"
		>
			{{ modelValue }}
		</div>

		<div
			v-if="isVisible"
			ref="timeframe"
			:class="classes.container"
		>
			<div :class="classes.title">Timeframe</div>

			<div :class="classes.content">
				<div
					v-for="item in timeframes"
					:key="item.value"
					:class="[
						classes.contentItem,
						{ [classes.contentItemActive]: item.value === modelValue },
					]"
					@click.prevent.stop="
						emits('update:modelValue', item.value);
						isVisible = false;
					"
				>
					<div :class="classes.contentItemName">
						{{ item.name }}
					</div>

					<ui-icon
						v-show="modelValue === item.value"
						:id="IconIds.Checkbox"
						:class="classes.icon"
						width="12"
						height="12"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.section {
	position: relative;
}

.timeframe {
	color: var(--text-color-base-300);
}

.container {
	position: absolute;
	top: 110%;
	left: 0;
	z-index: 10;
	width: 208px;
	padding: 6px;
	background: var(--bg-modal-color-base);
	border: 1px solid var(--border-modal-color-base);
	border-radius: 8px;
}

.title {
	padding: 12px;
	font-weight: 400;
	font-size: 13px;
	color: var(--text-color-base-300);
}

.contentItem {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 42px;
	padding: 0 12px;
	border-radius: 8px;
	cursor: pointer;
	transition: background 0.3s ease;
}

.contentItemActive {
	background: var(--bg-color-base-100);
}

.contentItemName {
	font-weight: 300;
	font-size: 12px;
	color: var(--text-color-base-500);
}

.contentItem:hover {
	background: var(--bg-color-base-100);
}

.icon {
	color: #ffffff;
}
</style>
