<script setup lang="ts">
import HeaderDesktopLoader from './header-desktop-loader.vue';
import DashboardContentLoader from './dashboard-content-loader.vue';
import HeaderMobileLoader from './header-mobile-loader.vue';

const props = defineProps<{
	isMobile: boolean;
}>();
</script>

<template>
	<div :class="classes.container">
		<header-desktop-loader v-if="!props.isMobile" />
		<dashboard-content-loader :is-mobile="props.isMobile" />
		<header-mobile-loader v-if="props.isMobile" />
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	margin: 8px 0;
	overflow: hidden;
	border: 1px solid #1d1d1e;
	border-radius: 18px;
}

@media (max-width: 768px) {
	.container {
		border-radius: 34px;
	}
}
</style>
