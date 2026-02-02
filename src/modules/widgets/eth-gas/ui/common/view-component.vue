<script setup lang="ts">
import { computed } from 'vue';

import { type ISize, type IGasStatsData, type IGasCardData } from '../../model';

import GasCard from '../common/gas-card-component.vue';
import GasStatsCard from '../common/gast-stats-data.vue';


export interface IViewComponentProps {
	gasStats: IGasStatsData;
	gasCards: IGasCardData[];
	size: ISize;
}


const props = defineProps<IViewComponentProps>();


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
				statsPosition: 'none' as const,
				isTable: true,
			};
		}
		if (h === 3) {
			return {
				columns: 1,
				showCards: 1,
				compact: false,
				gap: '12px',
				statsPosition: 'none' as const,
				isTable: true,
			};
		}

		if (h <= 5) {
			return {
				columns: 1,
				showCards: 3,
				compact: true,
				gap: '12px',
				statsPosition: 'none' as const,
				isTable: true,
			};
		}

		if (h <= 6) {
			return {
				columns: 1,
				showCards: 3,
				compact: false,
				gap: '8px',
				statsPosition: 'none' as const,
				isTable: true,
			};
		}
		if (h === 8) {
			return {
				columns: 1,
				showCards: 3,
				compact: false,
				gap: '16px',
				statsPosition: 'none' as const,
				isTable: true,
			};
		}
	}

	// ============================================
	// WIDTH 2
	// ============================================
	if (w === 2) {
		if (h === 2) {
			return {
				columns: 3,
				showCards: 3,
				compact: true,
				gap: '3px',
				statsPosition: 'none' as const,
				isTable: true,
			};
		}
		if (h <= 4) {
			return {
				columns: 3,
				showCards: 3,
				compact: false,
				gap: '3px',
				statsPosition: 'none' as const,
				isTable: true,
			};
		}

		if (h <= 5) {
			return {
				columns: 2,
				showCards: 3,
				compact: false,
				gap: '12px',
				statsPosition: 'none' as const,
				isTable: true,
			};
		}

		if (h <= 6) {
			return {
				columns: 2,
				showCards: 3,
				compact: false,
				gap: '20px',
				statsPosition: 'none' as const,
				isTable: true,
			};
		}

		if (h === 7) {
			return {
				columns: 2,
				showCards: 3,
				compact: true,
				gap: '12px',
				statsPosition: 'bottom' as const,
				isTable: true,
			};
		}
		if (h > 7) {
			return {
				columns: 2,
				showCards: 3,
				compact: false,
				gap: '12px',
				statsPosition: 'right' as const,
				isTable: true,
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
				statsPosition: 'none' as const,
				isTable: false,
			};
		}
		if (h === 3) {
			return {
				columns: 3,
				showCards: 3,
				compact: false,
				gap: '20px',
				statsPosition: 'none' as const,
				isTable: false,
			};
		}

		if ( h <= 5) {
			return {
				columns: 3,
				showCards: 3,
				compact: true,
				gap: '20px',
				statsPosition: 'bottom' as const,
				isTable: false,
			};
		}

		if (h <= 9) {
			return {
				columns: 3,
				showCards: 3,
				compact: false,
				gap: '20px',
				statsPosition: 'bottom' as const,
				isTable: true,
			};
		}
	}


	// ============================================
	// WIDTH 4+
	// ============================================
	if (w >= 4) {
		if (h === 2) {
			return {
				columns: 3,
				showCards: 3,
				compact: true,
				gap: '20px',
				statsPosition: 'right' as const,
				isTable: false,
			};
		}
		if (h === 3) {
			return {
				columns: 3,
				showCards: 3,
				compact: false,
				gap: '20px',
				statsPosition: 'right' as const,
				isTable: true,
			};
		}

		if ( h <= 5) {
			return {
				columns: 3,
				showCards: 3,
				compact: true,
				gap: '20px',
				statsPosition: 'bottom' as const,
				isTable: false,
			};
		}

		if (h <= 9) {
			return {
				columns: 3,
				showCards: 3,
				compact: false,
				gap: '20px',
				statsPosition: 'bottom' as const,
				isTable: true,
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
		statsPosition: 'none' as const,
		isTable: true,
	};
});
</script>

<template>
	<div
		:class="[
			classes.container,
			{
				[classes.withStatsRight]: layoutConfig.statsPosition === 'right',
				[classes.withStatsBottom]: layoutConfig.statsPosition === 'bottom'
			}
		]"
		:style="{
			'--cards-columns': layoutConfig.columns,
			'--gap': layoutConfig.gap
		}"
	>
		<div :class="classes.cardsContainer">
			<gas-card
				v-for="(data, index) in props.gasCards.slice(0, layoutConfig.showCards)"
				:key="index"
				:data="data"
				:compact="layoutConfig.compact"
				:class="{
					[classes.fullWidth]: layoutConfig.columns === 2 && index === 2
				}"
			/>
		</div>

		<!-- Статистика справа (для width 2) -->
		<gas-stats-card
			v-if="layoutConfig.statsPosition === 'right'"
			:class="classes.statsCard"
			:data="props.gasStats"
			:is-table="layoutConfig.isTable"
		/>

		<!-- Статистика снизу (для width 3+) -->
		<gas-stats-card
			v-if="layoutConfig.statsPosition === 'bottom'"
			:class="classes.bottomStatsCard"
			:data="props.gasStats"
			:is-table="layoutConfig.isTable"
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
	align-content: end;
}

/* Когда показываем статистику справа (width 2) */
.withStatsRight .cardsContainer {
	flex: 2;
}

.statsCard {
	flex: 1;
	min-width: 0;
}

/* Когда показываем статистику снизу (width 3+) */
.withStatsBottom {
	flex-direction: column;
	gap: 12px;
}

.withStatsBottom .cardsContainer {
	width: 100%;
}

.bottomStatsCard {
	width: 100%;
	margin-top: -4px;
}

.fullWidth {
	grid-column: 1 / -1;
}
</style>
