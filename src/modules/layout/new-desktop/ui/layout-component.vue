<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { useRoute } from 'vue-router';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { type IMenuItem, menuItems } from '@/modules/layout/new-desktop/model';
import { isFeatureEnabled } from '@/shared/lib';
import { ALL_MARKET_TYPES } from '@/modules/market';
import { type ITickerItem, TickerSelectorSearchModal } from '@/modules/ticker-selector';
import { UiPosition } from '@/shared/ui/position';
import { useGoToTickerPage } from '@/modules/ticker/composables';

import MenuItem from './menu-item.vue';
import ComingSoonTooltip from './coming-soon-tooltip.vue';
import ActionTooltip from './action-tooltip.vue';

interface ILayoutComponentProps {
	activeTicker?: ITickerItem | null;
}

const props = defineProps<ILayoutComponentProps>();

const route = useRoute();

function isActiveLink(link: IMenuItem['link']) {
	if (typeof link === 'string') {
		return link === route.path;
	}

	return link.name === route.name;
}

function isNestedActiveLink(link: IMenuItem['link']) {
	if (route.matched.length === 1) {
		return false;
	}

	if (typeof link === 'string') {
		return link === route.matched[0].path;
	}

	return link.name === route.matched[0].name;
}

const preparedMenuItems = computed(() => menuItems.map(item => ({
	...item,
	isActive: isActiveLink(item.link) || isNestedActiveLink(item.link),
})));

const tooltipRef = useTemplateRef('tooltip');

const { goToTickerPage } = useGoToTickerPage();

function onUpdateSelectedTickers(tickers: ITickerItem[]) {
	if (tickers.length === 0) {
		return;
	}

	const tickerId = tickers[0].canonical_ticker_id;

	if (props.activeTicker && props.activeTicker.canonical_ticker_id === tickerId) {
		return;
	}

	goToTickerPage(tickerId);

	tooltipRef.value?.handleClose?.();
}
</script>

<template>
	<div :class="classes.root">
		<div :class="[classes.panel, classes.leftPanel]">
			<div :class="classes.iconContainer">
				<div :class="classes.logo">
					<ui-icon
						:id="IconIds.LogoWithoutText"
						width="22px"
						height="18px"
					/>
				</div>
				<coming-soon-tooltip
					:disable="isFeatureEnabled('SHOW_CASHFLOW_PAGE_LINK')"
					title="Cashflow"
					text="Analyze your cash flow effortlessly — coming soon."
				>
					<menu-item
						:icon="IconIds.Cashflow"
						:is-active="false"
						text="Cashflow"
						link="/"
					/>
				</coming-soon-tooltip>

				<coming-soon-tooltip
					:disable="isFeatureEnabled('SHOW_ARBITRAGE_PAGE_LINK')"
					title="Arbitrage"
					text="Discover real-time arbitrage opportunities — coming soon."
				>
					<menu-item
						:icon="IconIds.Arbitrage"
						:is-active="false"
						text="Arbitrage"
						link="/"
					/>
				</coming-soon-tooltip>

				<div :class="classes.line" />
			</div>
			<div :class="classes.iconContainer">
				<template v-for="item in preparedMenuItems" :key="item.text">
					<coming-soon-tooltip
						v-if="item.comingSoon"
						:title="item.comingSoon.title"
						:text="item.comingSoon.text"
						:release="item.comingSoon.release"
					>
						<menu-item
							:icon="item.icon"
							:is-active="item.isActive"
							:text="item.text"
							:link="item.link"
						/>
					</coming-soon-tooltip>
					<menu-item
						v-else
						:icon="item.icon"
						:is-active="item.isActive"
						:text="item.text"
						:link="item.link"
					/>
				</template>
			</div>
			<div :class="classes.bottom">
				<coming-soon-tooltip
					:disable="isFeatureEnabled('SHOW_SET_UP_PAGE_LINK')"
					title="Set Up"
					text="Customize your experience with a personal setup — coming soon."
				>
					<menu-item
						:icon="IconIds.SetUp"
						:is-active="false"
						text="Set Up"
						link="/"
					/>
				</coming-soon-tooltip>
			</div>
		</div>
		<div :class="classes.center">
			<slot />
		</div>
		<div :class="[classes.panel, classes.rightPanel]">
			<div :class="classes.iconContainer">
				<ui-position ref="tooltip" placement="left-start">
					<template #title="{ isVisible }">
						<action-tooltip
							placement="left"
							title="Search"
							text="Discover tickers, data, and markets"
							:disable="isVisible"
						>
							<menu-item
								:icon="IconIds.Search"
								:is-active="isVisible"
								text="Search"
								link="/"
								@click.capture.prevent
							/>
						</action-tooltip>
					</template>
					<template #content>
						<ticker-selector-search-modal
							search-placeholder="Search for tickers..."
							:enabled-markets="ALL_MARKET_TYPES"
							:selected-tickers="props.activeTicker ? [props.activeTicker] : []"
							@update:selected-tickers="onUpdateSelectedTickers"
						/>
					</template>
				</ui-position>
				<coming-soon-tooltip
					placement="left"
					:disable="isFeatureEnabled('SHOW_ASK_AI_PAGE_LINK')"
					title="Ask AI"
					text="Get instant insights powered by AI — coming soon."
				>
					<menu-item
						:icon="IconIds.AskAI"
						:is-active="false"
						text="Ask AI"
						link="/"
					/>
				</coming-soon-tooltip>
				<coming-soon-tooltip
					placement="left"
					:disable="isFeatureEnabled('SHOW_DASHBOARD_WATCHLIST')"
					title="Watchlist"
					text="Track your favorite symbols — coming soon."
				>
					<menu-item
						:icon="IconIds.Watch"
						:is-active="false"
						text="Watch"
						link="/"
					/>
				</coming-soon-tooltip>
			</div>
			<div :class="[classes.iconContainer, classes.bottom]">
				<coming-soon-tooltip
					placement="left"
					:disable="isFeatureEnabled('SHOW_HELP_PAGE_LINK')"
					title="Help"
					text="Find answers and guidance — coming soon."
				>
					<menu-item
						:icon="IconIds.Help"
						:is-active="false"
						text="Help"
						link="/"
					/>
				</coming-soon-tooltip>

				<coming-soon-tooltip
					placement="left"
					:disable="isFeatureEnabled('SHOW_TRAY_PAGE_LINK')"
					title="Tray"
					text="Access your quick-view tray for essentials — coming soon."
				>
					<menu-item
						:icon="IconIds.Tray"
						:is-active="false"
						text="Tray"
						link="/"
					/>
				</coming-soon-tooltip>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.root {
	position: relative;
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}

.center {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	margin-right: 52px;
	margin-left: 52px;
}

.panel {
	position: fixed;
	top: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 52px;
	height: 100vh;
	padding: 12px 8px;
}

.iconContainer {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
}

.line {
	width: 16px;
	height: 1px;
	margin-bottom: 8px;
	background: rgb(255 255 255 / 18%);
}

.logo {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 44px;
	height: 44px;
	color: #ffffff;
}

.bottom {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	justify-content: flex-end;
	align-items: center;
	gap: 8px;
}

.rightPanel {
	right: 0;
}

.leftPanel {
	left: 0;
}
</style>
