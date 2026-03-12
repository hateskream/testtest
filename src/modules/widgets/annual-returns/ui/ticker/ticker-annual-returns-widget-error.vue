<script setup lang="ts">
import type { ITickerWidgetMeta } from '@/modules/ticker';
import {
	BaseTickerWidgetError,
	BaseTickerWidgetHeader,
	BaseTickerWidgetWrapper,
} from '@/modules/widgets/base';

interface ITickerAnnualReturnsWidgetErrorProps {
	meta: ITickerWidgetMeta;
}

interface ITickerAnnualReturnsWidgetErrorEmits {
	retry: [];
}

const props = defineProps<ITickerAnnualReturnsWidgetErrorProps>();
const emit = defineEmits<ITickerAnnualReturnsWidgetErrorEmits>();
</script>

<template>
	<base-ticker-widget-wrapper :class="classes.wrapper">
		<base-ticker-widget-header>
			{{ props.meta.name }}
		</base-ticker-widget-header>

		<base-ticker-widget-error :class="classes.error" @retry="emit('retry')" />
	</base-ticker-widget-wrapper>
</template>

<style module="classes">
.wrapper {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	min-width: 200px;
	height: 329px;
}

.error {
	display: grid;
	height: 100%;
	place-items: center;
}
</style>
