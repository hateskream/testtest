<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';

interface IMetricTrendBadge {
	trend: 'optimistic' | 'pessimistic' | 'neutral';
}

const props = defineProps<IMetricTrendBadge>();

</script>

<template>
	<div :class="[classes.container, classes[props.trend]]">
		<span>The economic outline is&nbsp;</span>

		<span v-if="props.trend === 'neutral'" :class="classes.value">Neutral</span>

		<template v-else-if="props.trend === 'pessimistic'">
			<span :class="classes.value">
				Pessimistic
			</span>
			<ui-icon
				:id="IconIds.Loosers"
				height="12px"
				width="12px"
				:class="classes.icon"
			/>
		</template>
		<template v-else-if="props.trend === 'optimistic'">
			<span :class="classes.value">
				Optimistic
			</span>
			<ui-icon
				:id="IconIds.Gainers"
				height="12px"
				width="12px"
				:class="classes.icon"
			/>
		</template>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	align-items: center;
	height: 24px;
	padding: 3px 6px;
	font-style: normal;
	font-weight: 400;
	font-size: 12.2px;
	line-height: 180%;
	color: rgb(255 255 255 / 96%);
	letter-spacing: 0.122px;
	background: rgb(73 73 80 / 22%);
	border-radius: 6px;
}

.optimistic > .value {
	color: #04eda0;
}

.pessimistic > .value {
	color: #fc1d4d;
}

.icon {
	margin-left: 3px;
}

.optimistic > .icon {
	color: #04eda0;
}

.pessimistic > .icon {
	color: #fc1d4d;
}
</style>
