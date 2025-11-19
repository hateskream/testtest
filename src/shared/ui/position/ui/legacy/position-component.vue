<script setup lang="ts">
import { useTemplateRef } from 'vue';

import type { IPositionProps } from '../../model';
import { UiPresence } from '@/shared/ui/presence';

import PositionRoot from '../position-root.vue';
import PositionTrigger from '../position-trigger.vue';
import PositionTeleport from '../position-teleport.vue';
import PositionContent from '../position-content.vue';

const props = withDefaults(defineProps<IPositionProps>(), {
	placement: 'right-end',
	trigger: 'click',
	offset: 6,
	strategy: 'absolute',
});

const rootRef = useTemplateRef('root');

defineExpose({
	get isVisible() {
		return rootRef.value?.isOpen ?? false;
	},
	get isPinned() {
		return rootRef.value?.isPinned ?? false;
	},
	get handleOpen() {
		return rootRef.value?.open;
	},
});
</script>

<template>
	<position-root
		ref="root"
		:trigger="props.trigger"
		:close-delay="props.closeDelay"
		:open-delay="props.openDelay"
		v-slot="{ isOpen, isPinned }"
	>
		<position-trigger>
			<slot
				name="title"
				:is-visible="isOpen"
				:is-pinned="isPinned"
			/>
		</position-trigger>

		<position-teleport>
			<ui-presence :state="isOpen" v-slot="{present}">
				<transition name="fade">
					<position-content
						v-if="present"
						:offset="props.offset"
						:strategy="props.strategy"
						:placement="props.placement"
					>
						<slot name="content" />
					</position-content>
				</transition>
			</ui-presence>
		</position-teleport>
	</position-root>
</template>

<style scoped>
.floating-inner {
	z-index: 101;
	max-height: 80svh;
	border-radius: 6px;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
