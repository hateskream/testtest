<script setup lang="ts">
import type { ITickerWidgetMeta } from '../../models';
import { BaseTickerWidgetHeader, BaseTickerWidgetWrapper } from '@/modules/widgets/base';

interface IProps {
	meta: ITickerWidgetMeta;
}

const props = defineProps<IProps>();
</script>

<template>
	<base-ticker-widget-wrapper>
		<base-ticker-widget-header>{{ props.meta.name }}</base-ticker-widget-header>
	</base-ticker-widget-wrapper>
</template>
