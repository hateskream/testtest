<script setup lang="ts">
import { computed } from 'vue';

import type { DateView, Page } from './model';

const emit = defineEmits<{
	'set-today': [];
}>();

interface IDatePickerHeaderProps {
	pages: Page[];
}

const props = defineProps<IDatePickerHeaderProps>();

const modelView = defineModel<DateView>('view', { required: true });

const viewLabel = computed(() => {
	if (props.pages.length === 0) {
		return '';
	}

	const [page] = props.pages;
	const view = modelView.value;

	if (view === 'monthly') {
		return page.monthTitle;
	}

	if (view === 'weekly') {
		return page.weekTitle;
	}

	return page.dayTitle;
});
</script>
<template>
	<div :class="classes.header">
		<button
			:class="classes.title"
			class="title-200"
		>
			{{ viewLabel }}
		</button>
		<button
			:class="classes.today"
			class="text-300-b"
			@click.stop="emit('set-today')"
		>
			Today
		</button>
	</div>
</template>

<style module="classes">
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}

.title {
	overflow: hidden;
	color: var(--text-500, rgb(255 255 255 / 96%));
	text-overflow: ellipsis;
	cursor: pointer;
}

.today {
	overflow: hidden;
	color: var(--text-300, rgb(255 255 255 / 60%));
	text-overflow: ellipsis;
	cursor: pointer;
	transition: color 0.2s ease;
}

.today:is(:hover, :active) {
	color: var(--text-500, rgb(255 255 255 / 96%));
}
</style>
