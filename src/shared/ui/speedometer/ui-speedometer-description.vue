<script setup lang="ts">
import type { CSSProperties } from 'vue';

import { UiTransitionFade } from '@/shared/ui/transition';
import { UiText } from '@/shared/ui/text';

interface IProps {
	value: number;
	color: CSSProperties['color'];
	title?: string;
	description?: string;
	descriptionColor?: CSSProperties['color'];
}

const props = withDefaults(defineProps<IProps>(), {
	title: undefined,
	description: undefined,
	descriptionColor: 'var(--text-300, rgba(255, 255, 255, 0.62))',
});
</script>

<template>
	<div :class="classes.root">
		<ui-text
			token="title-400"
			:class="classes.value"
			:style="{ color: props.color }"
		>
			{{ props.value }}
		</ui-text>
		<ui-transition-fade>
			<ui-text
				v-if="props.title"
				token="text-300-r"
			>
				{{ props.title }}
			</ui-text>
		</ui-transition-fade>
		<ui-transition-fade>
			<ui-text
				v-if="props.description"
				token="text-100-r"
				:style="{ color: props.descriptionColor }"
			>
				{{ props.description }}
			</ui-text>
		</ui-transition-fade>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.value {
	overflow: hidden;
	text-align: center;
	color: var(--color-text-base-500, #ffffff);
	text-overflow: ellipsis;
}
</style>
