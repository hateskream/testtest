<script setup lang="ts">
import { UiTransitionFade } from '@/shared/ui/transition';
import { UiText } from '@/shared/ui/text';

interface IProps {
	value: number;
	color: string;
	title?: string;
	description?: string;
}

const props = defineProps<IProps>();
</script>

<template>
	<div :class="classes.root">
		<ui-text
			token="text-500-b"
			:class="classes.value"
			:style="{ color: props.color }"
		>
			{{ props.value }}
		</ui-text>
		<ui-transition-fade>
			<ui-text
				v-if="props.title"
				:class="classes.title"
				token="text-300-r"
			>
				{{ props.title }}
			</ui-text>
		</ui-transition-fade>
		<ui-transition-fade>
			<ui-text
				v-if="props.description"
				token="text-300-b"
				:class="classes.description"
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
	gap: 4px;
}

.value {
	overflow: hidden;
	font-style: normal;
	font-weight: 460;
	font-size: var(--typography-headers-size-h03, 28px);
	line-height: 130%;
	text-align: center;
	color: var(--color-text-base-500, #ffffff);
	text-overflow: ellipsis;
}

.title {
	overflow: hidden;
	font-style: normal;
	font-weight: 400;
	font-size: var(--typography-paragraph-size-p00, 13px);
	line-height: 160%;
	color: var(--color-text-active-info-500-active, #ffffff);
	letter-spacing: 0.143px;
	text-overflow: ellipsis;
}

.description {
	overflow: hidden;
	font-style: normal;
	font-weight: 440;
	font-size: var(--typography-paragraph-size-p-02, 10px);
	line-height: 170%;
	color: var(--color-text-base-300, #9a9a9d);
	letter-spacing: 0.08px;
	text-overflow: ellipsis;
}
</style>
