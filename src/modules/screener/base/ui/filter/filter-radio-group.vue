<script setup lang="ts">
import { computed, watch } from 'vue';
import { notNullish } from '@vueuse/core';

import { IconIds } from '@/shared/ui/icon';
import { UiModalItemNumbered, UiModalItemSelector } from '@/shared/ui/modal-items';
import type { IFilterPreset, IFilterState } from '../../model';
import { UiTransitionFade } from '@/shared/ui/transition';
import { UiDriver } from '@/shared/ui/driver';
import { type KeydownNumber, useNumberKeydown } from '@/shared/composables/use-number-keydown.ts';

import FilterModalAction from './filter-modal-action.vue';

export interface IFilterRadioGroupProps {
	presets: IFilterPreset[];
	required?: boolean;
	keyNumbers?: boolean;
}

const props = defineProps<IFilterRadioGroupProps>();

const modelValue = defineModel<IFilterState>();

const selectedPresetId = computed(() => modelValue.value?.presetId);
const hasSelectedValue = computed(() => notNullish(modelValue.value?.selected));

function select(preset: IFilterPreset) {
	modelValue.value = {
		presetId: preset.id,
		selected: preset.condition,
	};
}

function clear() {
	modelValue.value = {
		selected: null,
	};
}

function getPresetIndex(key: KeydownNumber): number {
	return key === 0 ? 9 : key - 1;
}

function handleKeyDown(key: KeydownNumber) {
	const index = getPresetIndex(key);

	if (!props.keyNumbers || index >= props.presets.length) {
		return;
	}

	select(props.presets[index]);
}

const { stop, start } = useNumberKeydown(handleKeyDown);

watch(() => props.keyNumbers, value => {
	if (value) {
		start();
	} else {
		stop();
	}
}, { immediate: true });
</script>

<template>
	<div>
		<template
			v-for="(preset, index) in props.presets"
			:key="preset.id"
		>
			<ui-modal-item-numbered
				v-if="index < 10"
				:model-value="selectedPresetId === preset.id"
				:number="index < 9 ? index + 1 : 0"
				:class="classes.selector"
				@update:model-value="select(preset)"
			>
				<div :class="classes.selectorLabel">
					<span>{{preset.label}}</span>
					<template v-if="preset.description">
						<span>·</span>
						<span :class="classes.description">{{preset.description}}</span>
					</template>
				</div>
			</ui-modal-item-numbered>
			<ui-modal-item-selector
				v-else
				:model-value="selectedPresetId === preset.id"
				:class="classes.selector"
				@update:model-value="select(preset)"
			>
				<div :class="classes.selectorLabel">
					<span>{{preset.label}}</span>
					<template v-if="preset.description">
						<span>·</span>
						<span :class="classes.description">{{preset.description}}</span>
					</template>
				</div>
			</ui-modal-item-selector>
		</template>
		<ui-transition-fade>
			<div v-if="hasSelectedValue && !props.required || $slots['footer-actions']">
				<ui-driver />
				<slot name="footer-actions" />
				<ui-transition-fade>
					<filter-modal-action
						v-if="hasSelectedValue && !props.required"
						:icon="IconIds.Close"
						label="Clear"
						@click="clear"
					/>
				</ui-transition-fade>
			</div>
		</ui-transition-fade>
	</div>
</template>

<style module="classes">
.selector {
	position: relative;
	gap: 16px;
	height: auto;
	padding: 10px;
}

.selector:hover {
	background: var(--metrics-bg-control-300);
}

.selectorLabel {
	display: inline-flex;
	flex-wrap: wrap;
	gap: 6px;
}

.selector:hover .number {
	opacity: 0;
}

.description {
	font-size: 12px;
	color: var(--text-color-base-300);
}

.number {
	position: absolute;
	right: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 24px;
	height: 24px;
	font-weight: 300;
	font-size: 12px;
	color: var(--text-color-base-300);
	border: 1px solid var(--border-color-surface-02);
	border-radius: 9px;
}
</style>
