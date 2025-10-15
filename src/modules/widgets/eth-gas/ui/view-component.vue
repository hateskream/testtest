<script setup lang="ts">
import { computed } from 'vue';

import { type ISize } from '../model';

import GasCard from './gas-card-component.vue';
import type { IGasCardData } from './gas-card-component.vue';
import GasStatsCard from './gast-stats-data.vue';
import type { IGasStatsData } from './gast-stats-data.vue';

export interface IViewComponentProps {
	size: ISize;
}


const props = defineProps<IViewComponentProps>();


// Моковые данные для gas карточек
const gasData: IGasCardData[] = [
	{ type: 'slow', gwei: 0.28, time: 45, price: 0.02 },
	{ type: 'standard', gwei: 0.35, time: 20, price: 0.01 },
	{ type: 'fast', gwei: 0.39, time: 15, price: 0.03 },
];

// Моковые данные для статистики
const statsData: IGasStatsData = {
	lastBlock: 23181923,
	avgBlockSize: 217,
	pendingQueue: 129965,
	avgUtilization: 47.7,
};

const layoutConfig = computed(() => {
	const { w, h } = props.size;

	// ============================================
	// WIDTH 1
	// ============================================
	if (w === 1) {
		if (h === 2) {
			return {
				columns: 1,
				showCards: 1,
				compact: true,
				gap: '12px',
				showStats: false,
				showHorizontalStats: false,
			};
		}

		if (h <= 4) {
			return {
				columns: 1,
				showCards: 2,
				compact: true,
				gap: '12px',
				showStats: false,
				showHorizontalStats: false,
			};
		}

		if (h <= 7) {
			return {
				columns: 1,
				showCards: 3,
				compact: true,
				gap: '16px',
				showStats: false,
				showHorizontalStats: false,
			};
		}
		if (h === 8) {
			return {
				columns: 1,
				showCards: 3,
				compact: false,
				gap: '16px',
				showStats: false,
				showHorizontalStats: false,
			};
		}
	}

	// ============================================
	// WIDTH 2
	// ============================================
	if (w === 2) {
		if (h === 2) {
			return {
				columns: 2,
				showCards: 2,
				compact: true,
				gap: '16px',
				showStats: false,
				showHorizontalStats: false,
			};
		}

		if (h <= 5) {
			return {
				columns: 2,
				showCards: 3,
				compact: true,
				gap: '8px',
				showStats: false,
				showHorizontalStats: false,
			};
		}

		if (h <= 6) {
			return {
				columns: 2,
				showCards: 3,
				compact: false,
				gap: '20px',
				showStats: false,
				showHorizontalStats: false,
			};
		}

		if (h === 7) {
			return {
				columns: 1,
				showCards: 3,
				compact: true,
				gap: '20px',
				showStats: true,
				showHorizontalStats: false,
			};
		}
		if (h > 7) {
			return {
				columns: 1,
				showCards: 3,
				compact: false,
				gap: '20px',
				showStats: true,
				showHorizontalStats: false,
			};
		}
	}

	// ============================================
	// WIDTH 3+
	// ============================================
	if (w >= 3) {
		if (h === 2) {
			return {
				columns: 3,
				showCards: 3,
				compact: true,
				gap: '20px',
				showStats: false,
				showHorizontalStats: false,
			};
		}
		if (h ===3 ) {
			return {
				columns: 3,
				showCards: 3,
				compact: false,
				gap: '20px',
				showStats: false,
				showHorizontalStats: true,
			};
		}

		if (h >= 4 && h < 5) {
			return {
				columns: 3,
				showCards: 3,
				compact: true,
				gap: '20px',
				showStats: false,
				showHorizontalStats: true,
			};
		}

		if (h >= 5) {
			return {
				columns: 3,
				showCards: 3,
				compact: false,
				gap: '20px',
				showStats: false,
				showHorizontalStats: true,
			};
		}
	}

	// ============================================
	// DEFAULT FALLBACK
	// ============================================
	return {
		columns: Math.min(w, 3),
		showCards: 3,
		compact: false,
		gap: '16px',
		showStats: false,
		showHorizontalStats: false,
	};
});
</script>

<template>
	<div
		:class="[
			classes.container,
			{
				[classes.withStats]: layoutConfig.showStats,
				[classes.withHorizontalStats]: layoutConfig.showHorizontalStats
			}
		]"
		:style="{
			'--cards-columns': layoutConfig.columns,
			'--gap': layoutConfig.gap
		}"
	>
		<div :class="classes.cardsContainer">
			<gas-card
				v-for="(data, index) in gasData.slice(0, layoutConfig.showCards)"
				:key="index"
				:data="data"
				:compact="layoutConfig.compact"
			/>
		</div>

		<!-- Вертикальная статистика справа (для width 2) -->
		<gas-stats-card
			v-if="layoutConfig.showStats"
			:class="classes.statsCard"
			:data="statsData"
		/>

		<!-- Горизонтальная статистика снизу (для width 3+) -->
		<gas-stats-card
			v-if="layoutConfig.showHorizontalStats"
			:class="classes.horizontalStatsCard"
			:data="statsData"
			:is-horizontal="true"
		/>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	width: 100%;
	height: 100%;
	padding: 12px;
	gap: var(--gap, 16px);
}

/* Контейнер для газовых карточек */
.cardsContainer {
	display: grid;
	grid-template-columns: repeat(var(--cards-columns, 1), 1fr);
	gap: var(--gap, 16px);
	flex: 1;
	align-content: start;
}

/* Когда показываем вертикальную статистику (width 2) */
.withStats .cardsContainer {
	flex: 2;
}

.statsCard {
	flex: 1;
	min-width: 0;
}

/* Когда показываем горизонтальную статистику (width 3+) */
.withHorizontalStats {
	flex-direction: column;
	gap: 12px;
}

.withHorizontalStats .cardsContainer {
	width: 100%;
}

.horizontalStatsCard {
	width: 100%;
	margin-top: -4px;
}
</style>
