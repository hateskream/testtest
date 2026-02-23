<script setup lang="ts">
import type { Placement } from '@floating-ui/vue';

import { UiText } from '@/shared/ui/text';
import { UiClamped } from '@/shared/ui/clamped';

import ActionTooltip from './action-tooltip.vue';

const props = withDefaults(defineProps<{
	title: string;
	text: string;
	placement?: Placement;
	release?: string;
	disable?: boolean;
}>(), {
	release: 'Soon',
	placement: 'right',
	disable: false,
});
</script>

<template>
	<action-tooltip
		:title="props.title"
		:text="props.text"
		:disable="props.disable"
		:placement="props.placement"
	>
		<template #header>
			<ui-clamped
				:class="classes.title"
				:rows="1"
				as="span"
			>
				<ui-text token="text-200-b">{{ props.title }}</ui-text>
			</ui-clamped>
			<ui-clamped
				:class="classes.release"
				:rows="1"
				as="span"
			>
				{{ props.release }}
			</ui-clamped>
		</template>
		<slot />
	</action-tooltip>
</template>

<style module="classes">
.title {
	flex: 1 0 0;
	color: var(--text-500, rgb(255 255 255 / 96%));
}

.release {
	font-style: normal;
	font-weight: 490;
	font-size: 10px;
	line-height: 165%;
	color: #ffffff;
	letter-spacing: 0.08px;
	mask-composite: intersect;
	mask-image: linear-gradient(90deg, rgb(255 255 255 / 20%) 0%, #ffffff 42.69%, #ffffff 100%);
}
</style>
