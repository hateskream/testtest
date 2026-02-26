<script setup lang="ts">
import type { ITickerWidgetMeta } from '@/modules/ticker';
import { BaseTickerWidgetContent, BaseTickerWidgetHeader, BaseTickerWidgetWrapper } from '@/modules/widgets/base';
import { UiText } from '@/shared/ui/text';

const props = defineProps<{
	meta: ITickerWidgetMeta;
	text: string;
}>();
</script>

<template>
	<base-ticker-widget-wrapper>
		<base-ticker-widget-header>{{ props.meta.name }}</base-ticker-widget-header>
		<base-ticker-widget-content :class="classes.content">
			<ui-text token="text-200-r">
				{{props.text}}
			</ui-text>
		</base-ticker-widget-content>
	</base-ticker-widget-wrapper>
</template>

<style module="classes">
.content {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-self: stretch;
	padding:
		var(--padding-padding-s5, 8px) var(--padding-padding-s11, 20px)
		var(--padding-padding-s7, 12px) var(--padding-padding-s11, 20px);
}
</style>
