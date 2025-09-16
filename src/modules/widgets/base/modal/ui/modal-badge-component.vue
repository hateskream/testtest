<script setup lang="ts">
import { useTemplateRef, computed, type CSSProperties } from 'vue';

import { UiPosition } from '@/shared/ui/position';
import { ModalBadgeTitle } from '../index';

interface IProps {
	backgroundColor?: CSSProperties['backgroundColor'];
	color?: CSSProperties['color'];
	strategy?: 'fixed' | 'absolute';
}
const props = defineProps<IProps>();

// FIXME: Idk why but it doesnt work without type
const positionRef = useTemplateRef<{ isVisible: boolean }>('position');

const isVisible = computed(() => positionRef.value?.isVisible ?? false);
</script>

<template>
	<ui-position
		ref="position"
		position="bottom-start"
		:strategy="props.strategy"
	>
		<template #default>
			<modal-badge-title
				:background-color="props.backgroundColor"
				:color="props.color"
			>
				<!-- FIXME: I dont think that its should be in title, but i dont know how to put it in root -->
				<slot name="title" :is-visible="isVisible" />
			</modal-badge-title>
		</template>

		<template #content>
			<slot name="content" />
		</template>
	</ui-position>
</template>
