<script setup lang="ts">
import { ref, reactive, watch, defineComponent } from 'vue';

import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';

const GenericIcon = defineComponent({
	name: 'GenericIcon',
	template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
    </svg>
  `,
});

// Types
interface SectionItem {
	id: string;
	title: string;
	items: string[];
}

// State
const activeSection = ref<string | null>(null);
const selectedItem = ref<string | null>(null);

// Emit events for parent component communication
const emit = defineEmits<{
	sectionToggled: [sectionId: string | null];
	itemSelected: [sectionId: string, item: string];
}>();

// Data
const sections: SectionItem[] = reactive([
	{
		id: 'valuation',
		title: 'Valuation & Estimates',
		items: [
			'Price Target',
			'Analyst Ratings',
			'Operating Income Widget',
			'Net Income Widget',
		],
	},
	{
		id: 'earnings',
		title: 'Earnings',
		items: [
			'EPS Estimates',
			'Revenue Forecasts',
			'Earnings Calendar',
			'Historical Performance',
		],
	},
	{
		id: 'financials',
		title: 'Financials',
		items: [
			'Income Statement',
			'Balance Sheet',
			'Cash Flow',
			'Key Ratios',
		],
	},
	{
		id: 'insider',
		title: 'Insider Trading',
		items: [
			'Recent Transactions',
			'Executive Trades',
			'Institutional Holdings',
			'Form 4 Filings',
		],
	},
	{
		id: 'dividends',
		title: 'Dividends',
		items: [
			'Dividend History',
			'Yield Analysis',
			'Payout Ratio',
			'Ex-Dividend Dates',
		],
	},
	{
		id: 'peer',
		title: 'Peer Analysis',
		items: [
			'Competitor Comparison',
			'Industry Metrics',
			'Market Position',
			'Relative Valuation',
		],
	},
	{
		id: 'peer2',
		title: 'Peer Analysis',
		items: [
			'Competitor Comparison',
			'Industry Metrics',
			'Market Position',
			'Relative Valuation',
		],
	},
	{
		id: 'peer3',
		title: 'Peer Analysis',
		items: [
			'Competitor Comparison',
			'Industry Metrics',
			'Market Position',
			'Relative Valuation',
		],
	},
	{
		id: 'peer4',
		title: 'Peer Analysis',
		items: [
			'Competitor Comparison',
			'Industry Metrics',
			'Market Position',
			'Relative Valuation',
		],
	},
	{
		id: 'peer5',
		title: 'Peer Analysis',
		items: [
			'Competitor Comparison',
			'Industry Metrics',
			'Market Position',
			'Relative Valuation',
		],
	},
	{
		id: 'peer6',
		title: 'Peer Analysis',
		items: [
			'Competitor Comparison',
			'Industry Metrics',
			'Market Position',
			'Relative Valuation',
		],
	},
]);

// Methods
const toggleSection = (sectionId: string) => {
	activeSection.value = activeSection.value === sectionId ? null : sectionId;
	if (activeSection.value !== sectionId) {
		selectedItem.value = null;
	}
};

const selectItem = (sectionId: string, item: string) => {
	selectedItem.value = item;
	console.log(`Selected: ${item} from ${sectionId}`);
};

// Watch for changes and emit events
watch(activeSection, (newSection) => {
	emit('sectionToggled', newSection);
});

watch([activeSection, selectedItem], ([section, item]) => {
	if (section && item) {
		emit('itemSelected', section, item);
	}
});
</script>


<template>
	<chart-common-widget-layout>
		<template #header>
			<div :class="classes.header">
				<div :class="classes.navTabs">
					<button :class="[classes.navTab, classes.active]">Explore</button>
					<button :class="classes.navTab">My notes</button>
				</div>
			</div>
		</template>
		<template #body>
			<div :class="classes.accordionContent">
				<div :class="classes.scrollContainer">
					<div
						v-for="section in sections"
						:key="section.id"
						:class="classes.section"
					>
						<!-- Section Header - Sticky -->
						<div :class="classes.sectionHeader">
							<button
								:class="[
									classes.sectionButton,
									{ [classes.sectionButtonActive]: activeSection === section.id }
								]"
								@click="toggleSection(section.id)"
							>
								<svg
									:class="[
										classes.chevronIcon,
										{ [classes.chevronRotated]: activeSection === section.id }
									]"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="m9 18 6-6-6-6" />
								</svg>
								<div :class="classes.iconContainer">
									<generic-icon :class="classes.sectionIcon" />
								</div>
								<span :class="classes.sectionTitle">{{ section.title }}</span>
							</button>
						</div>

						<!-- Section Content -->
						<transition name="slide">
							<div v-if="activeSection === section.id" :class="classes.sectionItems">
								<button
									v-for="(item, index) in section.items"
									:key="index"
									:class="[
										classes.itemButton,
										{ [classes.itemButtonSelected]: selectedItem === item }
									]"
									@click="selectItem(section.id, item)"
								>
									<div :class="classes.iconContainer">
										<generic-icon :class="classes.itemIcon" />
									</div>
									<span :class="classes.itemText">{{ item }}</span>
								</button>
							</div>
						</transition>
					</div>
				</div>
			</div>
		</template>

	</chart-common-widget-layout>
</template>


<style module="classes">
/* CSS Custom Properties for easy theming */
:root {
	--bg-primary: #111827;
	--bg-secondary: #1f2937;
	--bg-tertiary: #374151;
	--text-primary: #ffffff;
	--text-secondary: #d1d5db;
	--text-muted: #9ca3af;
	--border-color: #374151;
	--hover-bg: #1f2937;
	--active-bg: #374151;
	--transition: all 0.15s ease-in-out;
}

/* Main container */
.accordionContainer {
	width: 20rem;
	background-color: var(--bg-primary);
	color: var(--text-primary);
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Header */
.header {
	padding: 1rem;
	border-bottom: 1px solid var(--border-color);
}

.navTabs {
	display: flex;
	gap: 1.5rem;
}

.navTab {
	background: none;
	border: none;
	color: var(--text-muted);
	font-weight: 500;
	font-size: 0.875rem;
	cursor: pointer;
	padding: 0;
	transition: var(--transition);

	&:hover {
		color: var(--text-primary);
	}

	&.active {
		color: var(--text-primary);
	}
}

/* Accordion content */
.accordionContent {
	height: 24rem;
	overflow: hidden;
}

.scrollContainer {
	height: 100%;
	overflow-y: auto;

	/* Custom scrollbar */

	&::-webkit-scrollbar {
		width: 6px;
	}

	&::-webkit-scrollbar-track {
		background: rgba(75, 85, 99, 0.2);
	}

	&::-webkit-scrollbar-thumb {
		background: rgba(75, 85, 99, 0.6);
		border-radius: 3px;

		&:hover {
			background: rgba(75, 85, 99, 0.8);
		}
	}
}

/* Sections */
.section {
	border-bottom: 1px solid var(--bg-secondary);
}

.sectionHeader {
	position: sticky;
	top: 0;
	background-color: var(--bg-primary);
	z-index: 10;
}

.sectionButton {
	width: 100%;
	padding: 1rem;
	display: flex;
	align-items: center;
	gap: 0.75rem;
	background: none;
	border: none;
	color: var(--text-primary);
	cursor: pointer;
	transition: var(--transition);
	text-align: left;

	&:hover {
		background-color: var(--hover-bg);
	}

	&.sectionButtonActive {
		background-color: var(--hover-bg);
	}
}

.chevronIcon {
	width: 1rem;
	height: 1rem;
	transition: transform 0.15s ease-in-out;
	flex-shrink: 0;

	&.chevronRotated {
		transform: rotate(90deg);
	}
}

.iconContainer {
	width: 1.5rem;
	height: 1.5rem;
	background-color: var(--bg-tertiary);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.sectionIcon,
.itemIcon {
	width: 0.75rem;
	height: 0.75rem;
}

.sectionTitle {
	font-weight: 500;
	flex: 1;
}

/* Section items */
.sectionItems {
	background-color: var(--bg-secondary);
}

.itemButton {
	width: 100%;
	padding: 0.75rem;
	padding-left: 3rem;
	display: flex;
	align-items: center;
	gap: 0.75rem;
	background: none;
	border: none;
	color: var(--text-primary);
	cursor: pointer;
	transition: var(--transition);
	text-align: left;

	&:hover {
		background-color: var(--active-bg);
	}

	&.itemButtonSelected {
		background-color: var(--active-bg);
	}
}

.itemText {
	color: var(--text-secondary);
	font-size: 0.875rem;
}

/* Slide animations */
:global(.slide-enter-active),
:global(.slide-leave-active) {
	transition: all 0.3s ease;
	overflow: hidden;
}

:global(.slide-enter-from),
:global(.slide-leave-to) {
	max-height: 0;
	opacity: 0;
}

:global(.slide-enter-to),
:global(.slide-leave-from) {
	max-height: 500px;
	opacity: 1;
}

/* Reset button styles */
button {
	font-family: inherit;

	&:focus {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
	}
}
</style>
