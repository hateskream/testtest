<script setup lang="ts">
import { ref } from 'vue';

import type { ITickerWidgetMeta } from '@/modules/ticker';
import {
	BaseTickerWidgetWrapper,
	BaseTickerWidgetHeader,
	BaseTickerWidgetContent,
} from '@/modules/widgets/base';
import { useQueryCompanyHeadquarters } from '../../queries';
import { UiControlButton } from '@/shared/ui/control-button';
import { IconIds } from '@/shared/ui/icon';

import TickerCompanyHeadquartersWidgetLoader from './ticker-company-headquarters-widget-loader.vue';
import TickerCompanyHeadquartersWidgetError from './ticker-company-headquarters-widget-error.vue';
import TickerCompanyHeadquartersWidgetModal from './ticker-company-headquarters-widget-modal.vue';
import HeadquartersCitiesContent from '../common/headquarters-cities-content.vue';

const props = defineProps<{
	meta: ITickerWidgetMeta;
}>();

const isFullscreen = ref(false);

const { data, isLoading, isError, refetch } = useQueryCompanyHeadquarters(
	() => props.meta.tickerId,
);

function onFullscreenClick() {
	isFullscreen.value = true;
}
</script>

<template>
	<ticker-company-headquarters-widget-loader
		v-if="isLoading"
		:meta="props.meta"
	/>

	<ticker-company-headquarters-widget-error
		v-else-if="isError || !data"
		:meta="props.meta"
		@retry="refetch"
	/>

	<base-ticker-widget-wrapper v-else>
		<base-ticker-widget-header>
			{{ props.meta.name }}
		</base-ticker-widget-header>
		<base-ticker-widget-content :class="classes.content">
			<headquarters-cities-content :data="data" :is-fullscreen="false" />

			<div :class="classes.expand">
				<div :class="classes.expanse">
					<ui-control-button
						token="m-24-bg"
						:icon-id="IconIds.ControlFullView"
						@click="onFullscreenClick"
					>
						All headquarters
					</ui-control-button>
				</div>
			</div>
		</base-ticker-widget-content>
	</base-ticker-widget-wrapper>

	<ticker-company-headquarters-widget-modal
		v-model="isFullscreen"
		:meta="props.meta"
		:data="data!"
	/>
</template>

<style module="classes">
.content {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-self: stretch;
	padding: 0;
}

.expand {
	display: flex;
	align-items: center;
	align-self: stretch;
	height: var(--height-height-s18, 52px);
	padding: 0 var(--padding-padding-s11, 20px);
	border-top: 1px solid var(--border-100, rgb(73 73 80 / 44%));
}

.expanse {
	display: flex;
	justify-content: center;
	align-items: center;
	align-self: stretch;
	padding: var(--padding-padding-s7, 12px) var(--padding-padding-s7, 12px) var(--padding-padding-s7, 12px) 0;
	gap: var(--padding-padding-s4, 6px);
}
</style>
