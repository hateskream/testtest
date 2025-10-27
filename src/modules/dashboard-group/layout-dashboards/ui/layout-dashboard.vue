<script setup lang="ts">
import HeaderComponent from './header-component.vue';
import SectionSlider from './section-slider.vue';

</script>

<template>
	<div :class="classes.root">
		<header-component />
		<section-slider />
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	margin: 8px 0;
	overflow-x: hidden;
	background: linear-gradient(140deg, rgb(17 17 19 / 80%) 22.94%, rgb(10 10 10 / 80%) 94.93%);
	border: 1px solid #1d1d1e;
	border-radius: 18px;
}
 </style>
