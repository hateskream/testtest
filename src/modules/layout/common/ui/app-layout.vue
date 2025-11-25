<script setup>
import { ref } from 'vue';

// import { HomeMobile, NewLayout } from '@/modules/layout';
import { useIsMobile } from '@/shared/composables';
import { NewLayout } from '../../new-desktop';

import HomeMobile from '../../mobile/ui/home-mobile.vue';

const isMobile = useIsMobile();

const isOpen = ref(false);

function close() {
	isOpen.value = false;
}
</script>

<template>
	<template v-if="isMobile">
		<home-mobile v-if="!isOpen" @click-i88="isOpen = true" />

		<transition
			name="slide-up-down"
			:enter-active-class="classes['slide-up-down-enter-active']"
			:leave-active-class="classes['slide-up-down-leave-active']"
			:enter-from-class="classes['slide-up-down-enter-from']"
			:leave-to-class="classes['slide-up-down-leave-to']"
			:enter-to-class="classes['slide-up-down-enter-to']"
			:leave-from-class="classes['slide-up-down-leave-from']"
		>
			<div
				v-if="isOpen"
				:class="classes.dashboard"
			>
				<slot :close="close" />
			</div>
		</transition>
	</template>
	<new-layout v-else>
		<slot />
	</new-layout>
</template>

<style module="classes">
.dashboard {
	position: fixed;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
	flex-direction: column;
	height: 100vh;
}

.slide-up-down-enter-active,
.slide-up-down-leave-active {
	transition: transform 0.3s ease;
}

.slide-up-down-enter-from,
.slide-up-down-leave-to {
	transform: translateY(100%);
}

.slide-up-down-enter-to,
.slide-up-down-leave-from {
	transform: translateY(0);
}
</style>
