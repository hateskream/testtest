<script setup lang="ts">
// import type { ITickerAction } from '../../model';

// const emit = defineEmits<{
// 	(event: 'add-ticker', payload: ITickerAction): void;
// 	(event: 'remove-ticker', payload: ITickerAction): void;
// }>();
</script>

<template>
	<div :class="classes.watchlistEmptyState">
		<img src="../../../../../assets/images/favorite.png" alt="">

		<div :class="classes.info">
			<div :class="classes.heading">
				Watchlist is empty
			</div>

			<div :class="classes.description">
				Add symbols
			</div>
		</div>
	</div>
</template>

<style module="classes">
.watchlistEmptyState {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
	border: 1px solid var(--color-border-surface-02, rgb(199 199 199 / 10%));
	border-radius: 18px;
	gap: 12px;
}

.info {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2px;
}

.heading {
	font-weight: 300;
	font-size: var(--typography-headers-size-h-01);
	text-align: center;
	color: #ffffff;
	letter-spacing: 0.104px;
}

.description {
	font-weight: 380;
	font-size: var(--typography-headers-size-h-02);
	color: var(--color-text-base-300, #9a9a9d);
	letter-spacing: 0.04px;
}
</style>
