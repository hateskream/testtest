<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';

import { type IPositionProps, UiPosition } from '@/shared/ui/position';

const props = withDefaults(defineProps<IPositionProps>(), {
	placement: 'bottom-start',
});

// FIXME: Idk why but it doesnt work without type
const positionRef = useTemplateRef<{ isVisible: boolean }>('position');

const isVisible = computed(() => positionRef.value?.isVisible ?? false);
</script>

<template>
	<ui-position
		ref="position"
		v-bind="props"
	>
		<template #title>
			<div :class="classes.icon">
				<!-- FIXME: I dont think that its should be in title, but i dont know how to put it in root -->
				<slot name="title" :is-visible="isVisible" />
			</div>
		</template>

		<template #content>
			<slot name="content" />
		</template>
	</ui-position>
</template>

<style module="classes">
.icon {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	width: max-content;
	height: auto;
	font-weight: 300;
	font-size: 10px;
	text-align: left;
	color: var(--text-color-base-300);
	background-color: var(--bg-color-base-300);
	border-radius: 18px;
	cursor: pointer;
	gap: 4px;
}
</style>
