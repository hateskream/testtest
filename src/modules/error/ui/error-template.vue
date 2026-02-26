<script setup lang="ts">
import { UiText } from '@/shared/ui/text';

const props = defineProps<{
	title?: string;
	description: string;
}>();
</script>

<template>
	<div :class="classes.template">
		<div :class="classes.code">
			<slot name="code" />
		</div>
		<ui-text
			v-if="props.title"
			token="title-500"
			as="p"
			:class="classes.title"
		>
			{{props.title}}
		</ui-text>
		<ui-text
			token="text-300-r"
			as="p"
			:class="classes.description"
		>
			{{props.description}}
		</ui-text>
		<div v-if="$slots.actions" :class="classes.actions">
			<slot name="actions" />
		</div>
	</div>
</template>

<style module="classes">
.template {
	display: flex;
	flex-direction: column;
	align-items: center;
	align-self: stretch;
	max-width: 600px;
	padding: 0 24px;
	gap: 16px;
}

.code {
	display: flex;
	justify-content: center;
	align-items: center;
	align-self: stretch;
	padding: 20px 10px 10px;
}

.title {
	text-align: center;
}

.description {
	text-align: center;
	white-space: pre-line;
}

.actions {
	display: flex;
	width: 100%;
	max-width: 440px;
	padding: 44px 0 20px;
	gap: 10px;
}
</style>
