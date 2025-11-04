<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

import { LayoutDashboard } from '@/modules/dashboard-group';
import { HomeMobile, NewLayout } from '@/modules/layout';

const isMobile = ref(window.innerWidth < 768);
const isOpen = ref(false);

const handleResize = () => {
	isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
	window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', handleResize);
});
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
				:class="classes['dashboard-sheet']"
			>
				<layout-dashboard @close="isOpen = false" />
			</div>
		</transition>
	</template>

	<new-layout v-else>
		<layout-dashboard />
	</new-layout>
</template>

<style module="classes">
.dashboard-sheet {
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
