<script setup lang="ts">
import { useRoute } from 'vue-router';

import { SCREENER_TABS } from '../model';

const route = useRoute();
</script>

<template>
	<div :class="classes.tabs">
		<router-link
			v-for="tab in SCREENER_TABS"
			:key="tab.id"
			:class="[classes.tab, {[classes.active]: route.name === tab.name}]"
			:to="{ name: tab.name }"
		>
			{{tab.label}}
		</router-link>
	</div>
</template>

<style module="classes">
.tabs {
	display: flex;
	align-items: center;
	gap: 10px;
}

.tab {
	height: 42px;
	padding: 10px 18px;
	font-weight: 300;
	font-size: 13px;
	line-height: 170%;
	color: #adadad;
	letter-spacing: 0.8%;
	background-color: var(--bg-color-base-300);
	border-radius: 42px;
	cursor: pointer;
}

.tab.active {
	color: #ffffff;
	background-color: rgb(51 51 51 / 80%);
}

.tab:hover:not(.active) {
	background-color: rgb(64 64 64 / 40%);
}
</style>
