<script setup lang="ts">
import {
	type IPositionProps,
	PositionContent,
	PositionRoot,
	PositionTeleport,
	PositionTrigger,
} from '@/shared/ui/position';
import { UiPresence } from '@/shared/ui/presence';

withDefaults(defineProps<IPositionProps>(), {
	trigger: 'hover',
	strategy: 'fixed',
	openDelay: 800,
	placement: 'bottom',
	transform: true,
});
</script>

<template>
	<position-root
		v-slot="{isOpen, isPinned, open, close}"
		:open-delay="openDelay"
		:close-delay="closeDelay"
		:trigger="trigger"
	>
		<position-trigger>
			<slot
				name="default"
				:is-open="isOpen"
				:is-pinned="isPinned"
				:open="open"
				:close="close"
			/>
		</position-trigger>
		<position-teleport>
			<ui-presence :state="isOpen" v-slot="{present}">
				<transition name="fade">
					<position-content
						v-if="present"
						:offset="offset"
						:placement="placement"
						:transform="transform"
						:strategy="strategy"
					>
						<slot
							name="content"
							:is-open="isOpen"
							:is-pinned="isPinned"
							:open="open"
							:close="close"
						/>
					</position-content>
				</transition>
			</ui-presence>
		</position-teleport>
	</position-root>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
