<script setup lang="ts">
import { computed, defineAsyncComponent, shallowRef, watch } from 'vue';

import { useDelayedLoading } from '@/shared/composables';
import { UiModalDialog } from '@/shared/ui/modal';
import { generateId, getWidgetComponent, type IMeta } from '../model';

interface IProps {
	meta: IMeta;
	displayVariant: 'tv' | 'dashboard';
}

const props = defineProps<IProps>();

const isOpenFullView = defineModel<boolean>({ required: true });

const { loading, triggerLoading } = useDelayedLoading();

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
});

const component = shallowRef(null);

watch(isOpenFullView, (value) => {
	if (!value) {
		loading.value = false;
		component.value = null;
		return;
	}

	loading.value = true;

	component.value = defineAsyncComponent({
		loader: getWidgetComponent('tv', props.meta.widgetType),
	});

	triggerLoading();
}, { immediate: true });
</script>

<template>
	<ui-modal-dialog
		ref="rootRef"
		v-model="isOpenFullView"
	>
		<component
			:is="component"
			:meta="preparedMeta"
			:style="style"
		/>
	</ui-modal-dialog>
</template>
