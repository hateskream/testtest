<script setup lang="ts">
import { UiTransitionFade } from '@/shared/ui/transition';
import { UiText } from '@/shared/ui/text';

interface IHistoryItem {
	style: {
		color: string;
	};
	name: string;
	tension: number;
}

const props = defineProps<{
	show: boolean;
	history: IHistoryItem[];
}>();
</script>

<template>
	<ui-transition-fade>
		<ul
			v-if="props.show"
			:class="classes.history"
		>
			<li
				v-for="item in props.history"
				:key="item.name"
			>
				<ui-text token="text-100-r">
					{{ item.name }}
				</ui-text>

				<ui-text token="text-100-r" :style="item.style">
					{{ item.tension }}
				</ui-text>
			</li>
		</ul>
	</ui-transition-fade>
</template>

<style module="classes">
.history {
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 165px;
}

.history li {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 4px 0;
}
</style>
