<script setup lang="ts">
import type { ITickerWidgetMeta } from '../../models';
import { BaseTickerWidgetHeader, BaseTickerWidgetWrapper } from '@/modules/widgets/base';
import { UiTag } from '@/shared/ui/tag';

interface IProps {
	meta: ITickerWidgetMeta;
}

const props = defineProps<IProps>();
</script>

<template>
	<base-ticker-widget-wrapper :class="classes.wrapper">
		<base-ticker-widget-header>{{ props.meta.name }}</base-ticker-widget-header>
		<div :class="classes.content">
			<ui-tag color="neutral">Widget under development</ui-tag>
		</div>
	</base-ticker-widget-wrapper>
</template>

<style module="classes">
.wrapper {
	display: flex;
	flex-direction: column;
}

.content {
	display: flex;
	flex-grow: 1;
	justify-content: center;
	align-items: center;
}
</style>
