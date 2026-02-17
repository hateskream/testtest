<script setup lang="ts">
import { UiText } from '@/shared/ui/text';
import { UiControlButton } from '@/shared/ui/control-button';
import { IconIds } from '@/shared/ui/icon';

const emits = defineEmits<{
	'request-feature': [];
}>();
</script>

<template>
	<section :class="classes.textBlock">
		<div :class="classes.head">
			<ui-text token="title-400">
				Thanks! Your idea is on its way
			</ui-text>

			<ui-text token="text-400-r" :class="classes.subheading">
				Got another idea? Feel <br>
				free to share more
			</ui-text>
		</div>

		<ui-control-button
			token="l-24-bg"
			:icon-id="IconIds.Feedback"
			@click="emits('request-feature')"
		>
			Request a feature
		</ui-control-button>
	</section>
</template>

<style module="classes">
.textBlock {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	align-items: flex-start;
	min-width: 300px;
	padding: 16px;
	border-radius: 8px;
	gap: 24px;
}

.head {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 12px;
	align-self: stretch;
}

.subheading {
	width: 187px;
	color: var(--color-text-base-300, #9a9a9d);
}
</style>
