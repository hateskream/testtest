<script setup lang="ts">
import { computed, watch } from 'vue';
import { notNullish } from '@vueuse/core';

import { IconIds } from '@/shared/ui/icon';
import { ModalItemSelector } from '@/modules/widgets/base';
import type { IFilterPreset, IFilterState } from '../../model';
import { UiTransitionFade } from '@/shared/ui/transition';
import { UiDriver } from '@/shared/ui/driver';
import { type KeydownNumber, useFilterKeydown } from '../../composables';

import FilterModalAction from './filter-modal-action.vue';

const modelValue = defineModel<IFilterState>();

const props = defineProps<{
	presets: IFilterPreset[];
	required?: boolean;
	keyNumbers?: boolean;
}>();

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

function handleKeyDown(key: KeydownNumber) {
	if (!props.keyNumbers || key > props.presets.length) {
		return;
	}

	select(props.presets[key - 1]);
}

const { stop, start } = useFilterKeydown(handleKeyDown);

watch(() => props.keyNumbers, value => {
	if (value) {
		start();
	} else {
		stop();
	}
});
</script>

<template>
	<div>
		<modal-item-selector
			v-for="(preset, index) in presets"
			:key="preset.id"
			:model-value="selectedPresetId === preset.id"
			:class="classes.selector"
			@update:model-value="select(preset)"
		>
			<div :class="classes.selectorLabel">
				<span>{{preset.label}}</span>
				<template v-if="preset.description">
					<span :class="classes.dot">·</span>
					<span :class="classes.description">{{preset.description}}</span>
				</template>
			</div>
			<div v-if="keyNumbers && index < 9 && modelValue?.presetId !== preset.id" :class="classes.number">
				{{ index + 1 }}
			</div>
		</modal-item-selector>
		<ui-transition-fade>
			<div v-if="hasSelectedValue && !required || $slots['footer-actions']">
				<ui-driver />
				<slot name="footer-actions" />
				<ui-transition-fade>
					<filter-modal-action
						v-if="hasSelectedValue && !required"
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
}

.selector:hover {
	background: var(--metrics-bg-control-300);
}

.selectorLabel {
	display: flex;
	flex-wrap: wrap;
	flex-grow: 0;
	max-width: 100%;
}

.selector:hover .number {
	opacity: 0;
}

.dot {
	margin: 0 5px;
}

.description {
	color: var(--text-color-base-300);
	font-size: 12px;
}

.number {
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
	position: absolute;
	right: 12px;
}
</style>
