<script setup lang="ts">
import { computed, onMounted, useTemplateRef } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiIconControl } from '@/shared/ui/icon-control';
import { UiTransitionFade } from '@/shared/ui/transition';

import BaseSearchComponent from '../../common/ui/base-search-component.vue';

interface IModalSearchProps {
	placeholder?: string;
	autofocus?: boolean;
}

const props = defineProps<IModalSearchProps>();

const model = defineModel<string>({
	required: true,
});

const hasModelValue = computed(() => model.value.trim().length > 0);

function clearModel() {
	model.value = '';
}

const searchRef = useTemplateRef('search');

function focus() {
	searchRef.value?.focus();
}

defineExpose({ focus });

onMounted(() => {
	if (props.autofocus) {
		focus();
	}
});
</script>

<template>
	<div :class="classes.container">
		<ui-icon
			:id="IconIds.Search"
			width="24"
			height="24"
			:class="classes.icon"
		/>
		<base-search-component
			ref="search"
			v-model="model"
			:placeholder="props.placeholder"
		/>
		<ui-transition-fade>
			<ui-icon-control
				v-show="hasModelValue"
				:icon="IconIds.Close"
				:class="classes.close"
				@click="clearModel"
			/>
		</ui-transition-fade>
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
	flex-shrink: 0;
	color: var(--icon-color-base-300);
}

.close {
	flex-shrink: 0;
	margin-right: 6px;
}
</style>
