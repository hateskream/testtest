<script setup lang="ts">
import { computed } from 'vue';

import Image from '@/assets/images/stock/META.png';
import BTCImage from '@/assets/images/market/BTC.png';
import { UiTransitionFade } from '@/shared/ui/transition';
import { UiImage } from '@/shared/ui/image';
import { UiTooltip } from '@/shared/ui/tooltip';
import type { IDisplaySettings, INews } from '../../model';

interface INewsComponent {
	news: INews;
	displaySettings: IDisplaySettings;
	displayVariant: 'tv' | 'dashboard';
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
			<div v-if="props.displaySettings.isShowSource" :class="classes.left">
				<ui-image
					:class="classes.icon"
					:src="Image"
					width="14px"
					height="14px"
				/>
			</div>
		</ui-transition-fade>

		<div :class="classes.right">
			<h3 :class="classes.title">
				{{props.news.title}}
			</h3>

			<ui-transition-fade>
				<p v-if="props.displaySettings.isShowDesc" :class="classes.description">
					{{props.news.description}}
				</p>
			</ui-transition-fade>

			<div :class="classes.controls">
				<div :class="classes.leftControls">
					<ui-transition-fade>
						<span v-if="props.displaySettings.isShowDate" :class="classes.time">
							{{time}}
						</span>
					</ui-transition-fade>
					<ui-transition-fade>
						<span v-if="props.displaySettings.isShowDate" :class="classes.dot">
							·
						</span>
					</ui-transition-fade>
					<ui-transition-fade>
						<span v-if="props.displaySettings.isShowAuthor" :class="classes.author">
							{{props.news.author}}
						</span>
					</ui-transition-fade>

					<ui-transition-fade>
						<div
							v-if="props.displaySettings.isShowSymbols"
							:class="classes.stocks"
						>
							<template
								v-for="stock in props.news.stocks"
								:key="stock.ticker"
							>
								<ui-tooltip>
									<template #content>
										{{ stock.name }}
									</template>

									<div :class="classes.stock">
										<ui-image
											:class="classes.stockImage"
											:src="BTCImage"
										/>
									</div>
								</ui-tooltip>
							</template>
						</div>
					</ui-transition-fade>
				</div>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	align-items: flex-start;
	align-self: stretch;
	padding: 14px 12px;
	gap: 6px;
	cursor: pointer;
	user-select: none;
}

.container:hover {
	background-color: var(--bg-color-base-100-effect);
}

.left {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 14px;
	height: 20px;
	padding: 3px 0;
}

.icon {
	display: flex;
	flex-shrink: 0;
	justify-content: center;
	align-items: center;
	width: 14px;
	min-width: 14px;
	height: 14px;
	aspect-ratio: 1/1;
	border-radius: 2px;
}

.right {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	align-items: flex-start;
	gap: 6px;
}

.title {
	align-self: stretch;
	font-style: normal;
	font-weight: 400;
	font-size: var(--font-text-300-r-size, 13.3px);
	line-height: 180%;
	color: var(--text-500, rgb(255 255 255 / 96%));
	letter-spacing: 0.146px;
}

.description {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	align-self: stretch;
	overflow: hidden;
	font-style: normal;
	font-weight: 400;
	font-size: var(--font-text-200-r-size, 12.2px);
	line-height: 180%;
	color: var(--text-300, rgb(255 255 255 / 62%));
	letter-spacing: 0.122px;
	text-overflow: ellipsis;
}

.controls {
	display: flex;
	align-items: flex-start;
	gap: 6px;
	align-self: stretch;
}

.leftControls {
	display: flex;
	flex: 1 0 0;
	flex-wrap: wrap;
	align-content: center;
	align-items: center;
	gap: 2px 6px;
}

.time {
	font-style: normal;
	font-weight: 400;
	font-size: var(--font-text-200-r-size, 12.2px);
	line-height: 180%;
	color: var(--text-300, rgb(255 255 255 / 62%));
	letter-spacing: 0.122px;
}

.dot {
	font-style: normal;
	font-weight: 440;
	font-size: var(--typography-paragraph-size-p-02, 10px);
	line-height: 170%;
	color: var(--text-300, rgb(255 255 255 / 62%));
	letter-spacing: 0.08px;
}

.author {
	font-style: normal;
	font-weight: 400;
	font-size: var(--font-text-200-r-size, 12.2px);
	line-height: 180%;
	color: var(--text-300, rgb(255 255 255 / 62%));
	letter-spacing: 0.122px;
}

.stocks {
	display: flex;
}

.stock {
	width: 20px;
	height: 20px;
	margin-left: -6px;
	overflow: hidden;
	border-radius: 16px;
	cursor: pointer;
}

.stocks > div:first-child .stock {
	margin-left: 0;
}

.stockImage {
	object-fit: cover;
}
</style>
