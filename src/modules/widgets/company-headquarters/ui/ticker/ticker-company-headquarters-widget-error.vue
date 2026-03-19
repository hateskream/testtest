<script setup lang="ts">
import type { ITickerWidgetMeta } from '@/modules/ticker';
import {
	BaseTickerWidgetError,
	BaseTickerWidgetHeader,
	BaseTickerWidgetWrapper,
} from '@/modules/widgets/base';

interface ITickerCompanyHeadquartersWidgetErrorProps {
	meta: ITickerWidgetMeta;
}

interface ITickerCompanyHeadquartersWidgetErrorEmits {
	retry: [];
}

const props = defineProps<ITickerCompanyHeadquartersWidgetErrorProps>();
const emit = defineEmits<ITickerCompanyHeadquartersWidgetErrorEmits>();
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
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	height: 468px;
}

.error {
	display: grid;
	height: 100%;
	place-items: center;
}
</style>
