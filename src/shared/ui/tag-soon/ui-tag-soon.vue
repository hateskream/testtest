<script setup lang="ts">
// Figma component: tag-soon

import { UiClamped } from '@/shared/ui/clamped';

export interface ITagSoonProps {
	text?: string;
}

const props = withDefaults(defineProps<ITagSoonProps>(), {
	text: 'Soon',
});
</script>

<template>
	<ui-clamped
		:class="classes.soon"
		:rows="1"
		as="span"
	>
		<slot>{{ props.text }}</slot>
	</ui-clamped>
</template>

<style module="classes">
@layer kit {
	.soon {
		font-style: normal;
		font-weight: 490;
		font-size: 10px;
		line-height: 165%;
		color: #ffffff;
		letter-spacing: 0.08px;
		mask-size: 200% 100%;
		mask-image:
			linear-gradient(
				90deg,
				rgb(255 255 255 / 20%) 0%,
				#ffffff 40%,
				#ffffff 60%,
				rgb(255 255 255 / 20%) 100%
			);
		transition: mask-position 0.6s ease;
	}

	.soon:hover {
		mask-position: -100% 0;
	}
}
</style>
