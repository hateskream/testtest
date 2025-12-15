<script setup lang="ts">
import { UiClamped } from '@/shared/ui/clamped';
import { UiText } from '@/shared/ui/text';

interface ISummaryComponentProps {
	text: string;
	summaryAt: string;
}

const props = defineProps<ISummaryComponentProps>();
</script>

<template>
	<div :class="classes.container">
		<ui-text token="text-300-r" as="div">
			<ui-clamped :class="classes.text" :rows="3">
				{{ props.text }}
			</ui-clamped>
		</ui-text>
		<ui-text
			:class="classes.summaryAt"
			token="text-200-r"
			as="div"
		>
			Summarized at {{ props.summaryAt }}
		</ui-text>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.text {
	color: rgb(255 255 255 / 96%);
}

.summaryAt {
	color: rgb(255 255 255 / 62%);
}
</style>
