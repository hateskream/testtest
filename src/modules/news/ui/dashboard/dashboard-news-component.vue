<script setup lang="ts">
import { computed } from 'vue';

import Image from '@/assets/images/stock/META.png';
import BTCImage from '@/assets/images/market/BTC.png';
import { UiTransitionFade } from '@/shared/ui/transition';
import { UiImage } from '@/shared/ui/image';
import { UiPositionTooltip } from '@/shared/ui/position';
import type { IDisplaySettings, INews } from '../../model';
import { DashboardTooltipWrapper } from '@/shared/ui/tooltip';
import { getDateFormatter } from '@/shared/lib';
import { UiText } from '@/shared/ui/text';
import { UiClamped } from '@/shared/ui/clamped';

interface INewsComponent {
	news: INews;
	displaySettings: IDisplaySettings;
	displayVariant: 'tv' | 'dashboard';
}

const props = defineProps<INewsComponent>();

const time = computed(() => {
	const date = new Date(props.news.timestamp);

	const formatter = getDateFormatter({
		day: '2-digit',
		month: 'short',
		hour12: true,
		hour: '2-digit',
		minute: '2-digit',
	});

	return formatter.format(date);
});
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
			<ui-text
				:class="classes.title"
				token="text-300-r"
				as="h3"
			>
				{{ props.news.title }}
			</ui-text>

			<ui-transition-fade>
				<ui-clamped
					v-if="props.displaySettings.isShowDesc"
					:rows="2"
					:class="classes.description"
				>
					<ui-text token="text-200-r">{{props.news.description }}</ui-text>
				</ui-clamped>
			</ui-transition-fade>

			<div :class="classes.controls">
				<div :class="classes.leftControls">
					<ui-transition-fade>
						<ui-text
							v-if="props.displaySettings.isShowDate"
							:class="classes.time"
							token="text-200-r"
						>
							{{time}}
						</ui-text>
					</ui-transition-fade>
					<ui-transition-fade>
						<ui-text
							v-if="props.displaySettings.isShowDate"
							:class="classes.dot"
							token="text-100-r"
						>
							·
						</ui-text>
					</ui-transition-fade>
					<ui-transition-fade>
						<ui-text
							v-if="props.displaySettings.isShowAuthor"
							:class="classes.author"
							token="text-200-r"
						>
							{{props.news.author}}
						</ui-text>
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
								<ui-position-tooltip>
									<div :class="classes.stock">
										<ui-image
											:class="classes.stockImage"
											:src="BTCImage"
										/>
									</div>

									<template #content>
										<dashboard-tooltip-wrapper>
											{{ stock.name }}
										</dashboard-tooltip-wrapper>
									</template>
								</ui-position-tooltip>
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
	border-radius: var(--radius-radius-s20-72, 28.4px);
	cursor: pointer;
	transition: background-color 0.2s ease-in-out;
	user-select: none;
	gap: 6px;
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
	color: var(--text-500, rgb(255 255 255 / 96%));
}

.description {
	align-self: stretch;
	color: var(--text-300, rgb(255 255 255 / 62%));
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
	color: var(--text-300, rgb(255 255 255 / 62%));
}

.dot {
	color: var(--text-300, rgb(255 255 255 / 62%));
}

.author {
	color: var(--text-300, rgb(255 255 255 / 62%));
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
