<script setup lang="ts">
import { ref } from 'vue';

import { UiImage } from '@/shared/ui/image';


const HEAVY_SRC = 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg';
// eslint-disable-next-line @stylistic/max-len
const LIGHT_SRC = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/200px-PNG_transparency_demonstration_1.png';

const src = ref(LIGHT_SRC);

function setHeavy() {
	src.value = HEAVY_SRC;
}

function setLight() {
	src.value = LIGHT_SRC;
}
</script>

<template>
	<div :class="classes.page">
		<h1>Image Race Condition Test</h1>
		<p>1. Set network to Slow 3G in DevTools, disable cache</p>
		<p>2. Click "Heavy", then quickly click "Light"</p>
		<p>3. The light image should stay, not be replaced by the heavy one</p>

		<div :class="classes.controls">
			<button :class="classes.btn" @click="setHeavy">
				Heavy ({{ HEAVY_SRC.slice(-20) }})
			</button>
			<button :class="classes.btn" @click="setLight">
				Light ({{ LIGHT_SRC.slice(-20) }})
			</button>
		</div>

		<p>Current src: {{ src.slice(-30) }}</p>

		<div :class="classes.imageWrapper">
			<ui-image
				:src="src"
				width="300px"
				height="200px"
				show-loader
				:timeout="60_000"
			/>
		</div>
	</div>
</template>

<style module="classes">
.page {
	padding: 24px;
	color: #ffffff;
}

.controls {
	display: flex;
	gap: 12px;
	margin: 16px 0;
}

.btn {
	padding: 8px 16px;
	color: #ffffff;
	background: #333333;
	border: 1px solid #555555;
	border-radius: 8px;
	cursor: pointer;
}

.btn:hover {
	background: #555555;
}

.imageWrapper {
	width: 300px;
	height: 200px;
	margin-top: 16px;
	overflow: hidden;
	border: 1px solid #444444;
	border-radius: 8px;
}
</style>
