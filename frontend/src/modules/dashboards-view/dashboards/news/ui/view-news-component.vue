<script setup lang="ts">
import type { INews } from '../model';

import NewsComponent from './news-component.vue';

interface IViewNewsComponentProps {
	news: INews[];
}

const props = defineProps<IViewNewsComponentProps>();
</script>

<template>
	<div :class="classes.root">
		<div :class="classes.scrollable">
			<div :class="classes.content">
				<news-component
					v-for="item in props.news"
					:key="item.id"
					v-bind="item"
				/>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
}

.scrollable {
	position: relative;
	flex: 1;
	overflow-x: hidden;
	overflow-y: auto;
}

.content {
	width: 100%;
	height: auto;
}
</style>
