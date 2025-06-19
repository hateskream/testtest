<script setup lang="ts">

import { ref } from 'vue';

import { ChartCommonWidgetLayout } from '../../shared/ui';

import FearGreedDashboard from '@/modules/widgets/fear-greed/ui/view-component.vue';

const tension = ref(25);
const randomTension = () => {
	tension.value = Math.floor(Math.random() * 100) + 1;
};
</script>

<template>
	<div :class="classes.sectionWrapper">
		<chart-common-widget-layout>
			<template #header>
				Sentiments
			</template>
			<template #body>
				<fear-greed-dashboard
					:tension="{tension:tension}"
					:size="{h:3, w:3}"
					@update-interactive="randomTension"
				/>
			</template>
		</chart-common-widget-layout>
		<div :class="classes.separator" />
		<chart-common-widget-layout>
			<template #header>
				The economic outline is <span :class="classes.potential">Optimistic</span>
			</template>
			<template #body>
				<div :class="classes.bodyWrapper">
					<div class="paragraph-p-01" :class="classes.text">
						UK's MPC votes shifted to 0-1-8, Bank Rate stable at 4.5%. SNB lowers rate to 0.25%. AU job
						losses surged to
						52.8K, UK claimants up to 44.2K.
					</div>
					<div class="paragraph-p-02" :class="classes.summarize">
						Summarized at 19:30
					</div>
				</div>

			</template>
		</chart-common-widget-layout>
	</div>
</template>

<style module="classes">
.separator {
	height: 1px;
	background: var(--border-color-surface-02-effect);
	margin: 0 8px;
}

.sectionWrapper {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.potential {
	display: inline-flex;
	align-items: center;
	padding: 1px 5px;
	font-weight: 440;
	font-size: 10px;
	line-height: 17px;
	color: #04eda0;
	background-color: rgb(31 31 31 / 70%);
	border-radius: 4px;
	gap: 4px;
}
.bodyWrapper {
	display: flex;
	flex-direction: column;
	gap: 8px;
}
.text{
	color: var(--text-color-base-500)
}
.summarize{
	color: var(--text-color-base-300)
}

</style>
