<script lang="ts" setup>
import { useCssModule } from 'vue';

const classes = useCssModule('classes');

const transitionClasses = {
	'enter-active-class': classes['fade-enter-active'],
	'leave-active-class': classes['fade-leave-active'],
	'enter-from-class': classes['fade-enter-from'],
	'leave-to-class': classes['fade-leave-to'],
};
</script>

<template>
	<transition v-bind="transitionClasses">
		<slot name="default" />
	</transition>
</template>

<style module="classes">
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
