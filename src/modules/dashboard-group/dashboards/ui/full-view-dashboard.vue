<script setup lang="ts">
import { computed } from 'vue';

import { useDelayedLoading } from '@/shared/composables';
import { UiModal } from '@/shared/ui/modal';
import { generateId, getWidgetComponent, type IMeta } from '../model';

interface IProps {
	meta: IMeta;
	displayVariant: 'tv' | 'dashboard';
}

const props = defineProps<IProps>();

const isOpenFullView = defineModel<boolean>({ required: true });

const { loading } = useDelayedLoading();

const preparedMeta = computed((): IMeta => ({
	...props.meta,
	widgetId: generateId(props.meta.widgetId),
	isOpenFull: true,
	size: props.meta.maxSize,
	isLoading: loading.value,
}));

const VERTICAL_PADDING = 160;
const HORIZONTAL_PADDING = 130;

const style = computed(() => {
	const { maxSize, columnWidth, rowHeight } = props.meta;

	if (props.displayVariant === 'tv') {
		let width = window.innerWidth - HORIZONTAL_PADDING;

		if (Number.isFinite(maxSize.w)) {
			width = maxSize.w * columnWidth;
		}

		let height = window.innerHeight - VERTICAL_PADDING;
		if (Number.isFinite(maxSize.h)) {
			height = maxSize.h * rowHeight;
		}

		return {
			width: `${width}px`,
			height: `${height}px`,
		};
	}

	// TODO: size calculation for fullscreen dashboard widgets
	const width = 4 * columnWidth;
	const height = 8 * rowHeight;

	return {
		width: `${width}px`,
		height: `${height}px`,
	};
});
</script>

<template>
	<ui-modal
		ref="rootRef"
		v-model="isOpenFullView"
	>
		<component
			:is="getWidgetComponent(props.displayVariant, props.meta.widgetType)"
			:meta="preparedMeta"
			:style="style"
		/>
	</ui-modal>
</template>
