<script setup lang="ts">

import { computed } from 'vue';

const { fill = '230, 23, 53', width = 50, height = 50, shadow = '230 23 53' } = defineProps<{
	fill?: string;
	shadow?: string;
	width?: number | string;
	height?: number | string;
}
>();
const fillRgba = computed(() => {
	return `rgba(${fill})`;
});

</script>


<template>
	<div :class="classes.logo">
		<svg
			:width="width"
			:height="height"
			viewBox="0 0 50 50"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M40.6558 20.9162C41.3027 16.5301 37.982 14.1913 33.4087 12.6033L34.89 6.69304L31.2783
			5.7942L29.8373
			11.5588L26.955 10.8696L28.4162 5.0636L24.8031 4.16602L23.3206 10.0976L21.0233 9.55404V9.53393L16.032
			8.27981L15.0704 12.1438C15.0704 12.1438 17.7444 12.7715 17.7017 12.7916C19.1642 13.1682 19.4152 14.1286
			19.3738
			14.8805L17.7017 21.6471L18.0783 21.7725L17.6816 21.6883L15.3215 31.15C15.1545 31.5894 14.6938
			32.2571 13.672
			31.9848C13.7134 32.0477 11.0608 31.3585 11.0608 31.3585L9.26562 35.4733L13.9645 36.6421L16.5329
			37.3114L15.029
			43.3056L18.6419 44.2031L20.1044 38.2716L23.007 39.0235L21.5254 44.9339L25.137 45.8327L26.6198
			39.8385C32.781
			41.0071 37.4185 40.5491 39.3616 34.9712C40.927 30.4821 39.2777 27.9125 36.04 26.2002C38.4002 25.6779
			40.1752 24.111 40.6348 20.915L40.6558 20.9162ZM32.4058 32.4871C31.2985 36.9775 23.7387 34.5331 21.2958
			33.9481L23.2793 25.9916C25.7223 26.6181 33.5758 27.8083 32.4058 32.4656V32.4871ZM33.5131 20.8535C32.5098
			24.926 26.2031 22.8583 24.1768 22.3575L25.9718 15.1517C28.0193 15.6538 34.5775 16.6142 33.5131 20.8535Z"
				:fill="fillRgba"
			/>
		</svg>
	</div>
</template>
<style module="classes">
.logo {
	position: relative;
	width: 80px;
	height: 80px;
	padding: 15px;
	background: rgb(228 228 231 / 4%);
	border-radius: 80px;
	box-shadow: -1.441px 1.441px 0 0 rgb(255 255 255 / 40%) inset;
	cursor: pointer;
	user-select: none;
}

.logo::after {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 330%;
	height: 150%;
	background: rgb(v-bind(shadow) 16%);
	transform: translate(-22%, -30%);
	filter: blur(88px);
	pointer-events: none;
}

</style>


