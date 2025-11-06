<script setup lang="ts">
import { computed } from 'vue';

import Image from '@/assets/images/stock/META.png';
import { UiImage } from '@/shared/ui/image';
import { type INews } from '../model/news';
import { UiTransitionFade } from '@/shared/ui/transition';
import { UiTooltip } from '@/shared/ui/tooltip';
import type { IDisplaySettings } from '../model';

import NewsIconScoreComponent from './news-icon-score-component.vue';

interface INewsComponent {
	news: INews;
	displaySettings: IDisplaySettings;
}

const props = defineProps<INewsComponent>();

const time = computed(() =>
	new Date(props.news.timestamp).toLocaleDateString('en-US', {
		day: '2-digit',
		month: 'short',
		hour12: true,
		hour: '2-digit',
		minute: '2-digit',
	}),
);
</script>

<template>
	<div :class="classes.container">
		<ui-transition-fade>
			<div
				v-if="props.displaySettings.isShowSource"
				:class="classes.newsLeftImageWrapper"
			>
				<ui-image
					:class="classes.newsLeftImage"
					:src="Image"
				/>
			</div>
		</ui-transition-fade>

		<div :class="classes.newsContent">
			<div :class="classes.newsTitle">
				<h3>{{ props.news.title }}</h3>
			</div>

			<ui-transition-fade>
				<div
					v-if="props.displaySettings.isShowDesc"
					:class="classes.newsDesc"
				>
					<p>
						{{ props.news.description }}
					</p>
				</div>
			</ui-transition-fade>

			<div :class="classes.newsOther">
				<ui-transition-fade>
					<div v-if="props.displaySettings.isShowDate">
						<time
							:class="classes.newsOtherText"
							:datetime="time"
						>
							{{ time }}
						</time>
					</div>
				</ui-transition-fade>

				<ui-transition-fade>
					<span
						v-if="props.displaySettings.isShowDate && props.displaySettings.isShowAuthor"
						:class="classes.newsOtherText"
					>
						·
					</span>
				</ui-transition-fade>

				<ui-transition-fade>
					<div v-if="props.displaySettings.isShowAuthor">
						<small :class="[classes.newsOtherText, classes.newsOtherAuthorText]">
							{{ props.news.author }}
						</small>
					</div>
				</ui-transition-fade>

				<ui-transition-fade>
					<div
						v-if="props.displaySettings.isShowSymbols"
						:class="classes.newsStocks"
					>
						<template
							v-for="stock in props.news.stocks"
							:key="stock.ticker"
						>
							<ui-tooltip>
								<template #content>
									{{ stock.name }}
								</template>

								<div :class="classes.newsStock">
									<ui-image
										:class="classes.newsStockImage"
										:src="stock.srcImage"
										replacement="/images/market/ADA.png"
									/>
								</div>
							</ui-tooltip>
						</template>
					</div>
				</ui-transition-fade>

				<ui-transition-fade>
					<news-icon-score-component
						v-if="props.displaySettings.isShowScore"
						:score="props.news.score"
					/>
				</ui-transition-fade>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	width: 100%;
	padding: 14px 12px;
	border-radius: 18px;
	cursor: pointer;
	transition: background-color 0.3s ease;
	gap: 6px;
}

.container:hover {
	background-color: var(--bg-color-base-100-effect);
}

.newsLeftImageWrapper {
	flex: 0 0 18px;
	height: 18px;
}

.newsContent {
	flex: 1 1 100%;
}

.newsLeftImage {
	border-radius: 4px;
	object-fit: cover;
}

.newsOtherAuthorText {
	transition: color 0.3s ease;
}

.newsOtherAuthorText:hover {
	color: var(--text-color-base-300-effect);
	cursor: pointer;
}

.newsTitle {
	margin-bottom: 6px;
}

.newsTitle > h3 {
	font-weight: 300;
	font-size: 13px;
	color: var(--text-color-base-500);
}

.newsDesc {
	margin-bottom: 6px;
}

.newsDesc > p {
	font-weight: 440;
	font-size: 10px;
	color: var(--text-color-base-300);
	letter-spacing: 0.08px;
}

.newsOther {
	position: relative;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 6px;
	padding-right: 32px;
}

.newsOtherText {
	font-weight: 440;
	font-size: 10px;
	color: var(--text-color-base-300);
	letter-spacing: 0.08px;
}

.newsStocks {
	display: flex;
}

.newsStock {
	width: 20px;
	height: 20px;
	margin-left: -6px;
	overflow: hidden;
	border: 2px solid #222223;
	border-radius: 16px;
	cursor: pointer;
}

.newsStocks > div:first-child .newsStock {
	margin-left: 0;
}

.newsStockImage {
	object-fit: cover;
}
</style>
