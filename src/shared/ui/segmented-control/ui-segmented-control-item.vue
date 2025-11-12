<script setup lang="ts">
import { computed, useSlots } from 'vue';

import { useSegmentedControl } from './composables/use-segmented-control.ts';

const props = defineProps<{
	value: string | number;
}>();
const slots = useSlots();

const control = useSegmentedControl();

const active = computed(() => control.getValue() === props.value);

function onClick() {
	control.select(props.value);
}
</script>

<template>
	<button
		:data-value="props.value"
		:class="[classes.item, active && classes.active]"
		@click="onClick"
	>
		<template v-if="slots.default">
			<slot />
		</template>
		<template v-else>
			{{props.value}}
		</template>
	</button>
</template>

<style module="classes">
.item {
	position: relative;
	z-index: 1;
	display: flex;
	flex: 1 0 0;
	justify-content: center;
	align-items: center;
	padding: 4px 8px;
	font-size: 12px;
	line-height: 170%;
	color: #9a9a9d;
	white-space: nowrap;
	border-radius: 9999px;
	cursor: pointer;
	transition: color 0.2s ease;
	user-select: none;
}

.active {
	color: #ffffff;
}
</style>
