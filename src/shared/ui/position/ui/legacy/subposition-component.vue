<script setup lang="ts">
import type { IFloatingOptions } from '../../model';
import { matchesTrigger } from '../../utils';

import SubpositionRoot from '../sub/subposition-root.vue';
import SubpositionTrigger from '../sub/subposition-trigger.vue';
import SubpositionContent from '../sub/subposition-content.vue';

interface ISubpositionProps extends IFloatingOptions {
	hoverPadding?: number;
}

const props = withDefaults(defineProps<ISubpositionProps>(), {
	placement: 'right-end',
	trigger: 'hover',
	offset: 6,
	strategy: 'fixed',
	hoverPadding: 8,
	openDelay: 20,
	closeDelay: (_props) => {
		if (_props.trigger && matchesTrigger(_props.trigger, ['hover'])) {
			return 150;
		}

		return 0;
	},
});
</script>

<template>
	<subposition-root
		:trigger="props.trigger"
		:close-delay="props.closeDelay"
		:open-delay="props.openDelay"
		v-slot="{isOpen, isPinned}"
	>
		<subposition-trigger>
			<slot
				name="title"
				:is-visible="isOpen"
				:is-pinned="isPinned"
			/>
		</subposition-trigger>
		<subposition-content
			:offset="props.offset"
			:strategy="props.strategy"
			:placement="props.placement"
		>
			<slot name="content" />
		</subposition-content>
	</subposition-root>
</template>

<style scoped>
.inner {
	border-radius: 6px;
}

.scroll-wrapper {
	max-height: 80svh;
	overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.15s ease;
	pointer-events: none;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
