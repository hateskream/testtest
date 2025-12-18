<script setup lang="ts">
import { computed } from 'vue';

import type { TextToken } from './token.ts';

interface IUiTextProps {
	token: TextToken;
	as?: string;
	align?: 'left' | 'right' | 'center' | 'inherit';
	text?: string;
}

const props = withDefaults(defineProps<IUiTextProps>(), {
	as: 'span',
	align: 'inherit',
	text: '',
});

const alignClass = computed(() => `text-${props.align}`);
</script>

<template>
	<component :is="props.as" :class="[alignClass, props.token]">
		<slot>{{ props.text }}</slot>
	</component>
</template>

<style>
.text-inherit {
	text-align: inherit;
}

.text-center {
	text-align: center;
}

.text-right {
	text-align: right;
}

.text-left {
	text-align: left;
}
</style>
