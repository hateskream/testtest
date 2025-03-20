<script setup lang="ts">
import { computed } from 'vue';

import type { IFearGreedProps, ITensionTextData } from '../model/tension.ts';
import { useMapTension } from '../composables/use-map-tension.ts';
import { useQueryTension } from '../queries/use-query-tension.ts';
import { BaseDashboardComponent } from '../../base/index.ts';
import { IconIds } from '@/shared/ui/icon/icons.ts';

import IconComponent from '@/shared/ui/icon/icon-component.vue';

const props = withDefaults(defineProps<IFearGreedProps>(), {
	showChart: true,
	showChartDescription: true,
});

const { mapTension } = useMapTension();

const { data } = useQueryTension(props.market);

const tensionText = computed<ITensionTextData>(() => mapTension(data.value?.tension ?? 0));

const history = computed(() =>
	Object.entries(data.value?.history ?? {}).map(([key, val]) => ({
		style: { color: mapTension(val).colors.text },
		name: key,
		tension: val,
	})),
);
</script>

<template>
	<base-dashboard-component :class="classes.root">
		<template #title>
			<div>Fear & Greed</div>
		</template>

		<div :class="classes.container">
			<div
				:class="classes.metric"
				:style="{ flexDirection: showChart ? 'column' : 'unset' }"
			>
				<div :class="classes.metricСhart">
					<div
						v-if="showChart"
						:class="classes.metricСhartLine"
					>
						<icon-component
							:id="IconIds.FearGreedHalfCircle"
							width="100%"
							height="100%"
						/>
					</div>

					<h3 :style="{ color: tensionText?.colors.text }">
						{{ data?.tension }}
					</h3>
				</div>

				<div :class="classes.metricDescription">
					<h4>{{ tensionText?.text.main }}</h4>
					<small>{{ tensionText?.text.sub }}</small>
				</div>
			</div>

			<ul
				v-if="history.length > 0"
				:class="classes.history"
			>
				<li
					v-for="item in history"
					:key="item.name"
				>
					<p>{{ item.name }}</p>
					<p :style="item.style">
						{{ item.tension }}
					</p>
				</li>
			</ul>
		</div>
	</base-dashboard-component>
</template>

<style module="classes">
.root {
	flex-grow: 0.99;
	flex-basis: 0;
}

.container {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	max-width: 329px;
	gap: 25px 48px;
	margin-top: 18px;
}

.metric {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 12px;
}

.metricСhart {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.metricСhart > h3 {
	font-weight: 460;
	font-size: 28px;
	color: var(--common-color-white-700);
}

.metricСhartLine {
	margin-bottom: -85px;
}

.metricDescription {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;
}

.history {
	width: 100%;
	max-width: 139px;
}

.history li {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 4px;
}

.history li > p:first-child {
	font-weight: 440;
	font-size: 12px;
	color: var(--text-color-base-300);
}

.history li > p:last-child {
	font-weight: 440;
	font-size: 12px;
	color: #ffffff;
}

.metricDescription > h4 {
	font-size: 13px;
	color: var(--common-color-white-700);
}

.metricDescription > small {
	font-weight: 440;
	font-size: 10px;
	color: var(--text-color-base-300);
}
</style>
