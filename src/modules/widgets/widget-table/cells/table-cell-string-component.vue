<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';

export interface ITextCell {
	value?: string;
}

interface IProps {
	data: ITextCell;
	align?: 'left' | 'right';
}

const props = defineProps<IProps>();

const alignmentStyle = computed((): CSSProperties => {
	return props.align === 'left' ? { textAlign: 'left' } : {};
});
</script>

<template>
	<div
		:class="classes.text"
		:style="alignmentStyle"
		class="text-300-r"
	>
		{{ props.data?.value ?? '—' }}
	</div>
</template>

<style module="classes">
.text {
	line-height: 1;
	text-align: right;
	color: var(--text-color-base-500);
}
</style>
