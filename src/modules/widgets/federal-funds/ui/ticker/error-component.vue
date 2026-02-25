<script setup lang="ts">
import {
	BaseTickerWidgetContent,
	BaseTickerWidgetError,
	BaseTickerWidgetHeader,
	BaseTickerWidgetWrapper,
} from '@/modules/widgets/base';
import type { ITickerWidgetMeta } from '@/modules/ticker';

interface IErrorProps {
	meta: ITickerWidgetMeta;
}

const props = defineProps<IErrorProps>();

const emit = defineEmits<{
	retry: [];
}>();
</script>

<template>
	<base-ticker-widget-wrapper>
		<base-ticker-widget-header>
			{{ props.meta.name }}
		</base-ticker-widget-header>
		<base-ticker-widget-content>
			<base-ticker-widget-error @retry="emit('retry')" />
		</base-ticker-widget-content>
	</base-ticker-widget-wrapper>
</template>
