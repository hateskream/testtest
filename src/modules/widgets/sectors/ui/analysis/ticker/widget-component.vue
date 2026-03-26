<script setup lang="ts">
import { defineAsyncComponent, useTemplateRef, watch } from 'vue';

import {
	BaseTickerWidgetContent,
	BaseTickerWidgetError,
	BaseTickerWidgetHeader,
	BaseTickerWidgetWrapper,
} from '@/modules/widgets/base';
import type { ITickerWidgetMeta } from '@/modules/ticker';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { useQuerySectorsAnalysis } from '../../../queries';

import PreloaderComponent from './preloader-component.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('./base-view.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseTickerWidgetError,
});

interface IProps {
	meta: ITickerWidgetMeta;
}

const props = defineProps<IProps>();

const emit = defineEmits<{
	changeOverflow: [value: boolean];
}>();

const {
	data,
	isLoading,
	isError,
	refetch,
} = useQuerySectorsAnalysis(() => props.meta.tickerId);

function checkOverflowing(element: HTMLDivElement) {
	emit('changeOverflow', element.scrollHeight > element.clientHeight);
}

const viewRef = useTemplateRef('viewRef');

watch(viewRef, value => {
	if (!value) {
		return;
	}

	checkOverflowing(value.$el as HTMLDivElement);
});

watch(data, (value, oldValue) => {
	if (!value || !oldValue) {
		return;
	}

	if (viewRef.value) {
		checkOverflowing(viewRef.value.$el as HTMLDivElement);
	}
});
</script>

<template>
	<base-ticker-widget-wrapper :class="classes.wrapper">
		<base-ticker-widget-header :class="classes.header">
			<template #left>
				<ui-icon
					:id="IconIds.Flash"
					width="16px"
					height="16px"
				/>
			</template>
			<template #default>
				<span :class="classes.headerName">{{ props.meta.name }}</span>
			</template>
		</base-ticker-widget-header>
		<base-ticker-widget-content :class="classes.content">
			<base-ticker-widget-error
				v-if="isError"
				:class="classes.error"
				@retry="refetch"
			/>
			<preloader-component v-else-if="isLoading" />
			<view-component
				v-else-if="data"
				ref="viewRef"
				:data="data"
			/>
		</base-ticker-widget-content>
	</base-ticker-widget-wrapper>
</template>

<style module="classes">
.wrapper {
	display: flex;
	flex-direction: column;
	align-self: stretch;
	background: linear-gradient(0deg, rgb(109 0 252 / 10%) 0%, rgb(109 0 252 / 10%) 100%), #131315;
	border: 1px solid rgb(92 60 169 / 30%);
}

.header {
	justify-content: flex-start;
	gap: 0;
	color: #8759fc;
}

.headerName {
	color: #8759fc;
}

.error {
	flex-grow: 1;
}

.content {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	justify-content: flex-start;
	min-height: 0;
}
</style>
