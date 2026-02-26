<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<div :class="classes.headerPreloader">
		<ui-skeleton
			:class="classes.logo"
			width="56px"
			height="56px"
			shape="circle"
		/>
		<div :class="classes.content">
			<div :class="classes.tickerInfo">
				<ui-skeleton
					:class="classes.breadcrumbs"
					height="var(--height-s12, 24px)"
					width="100px"
				/>
				<ui-skeleton height="var(--height-s14, 32px)" width="200px" />
				<ui-skeleton height="var(--height-s14, 20px)" width="200px" />
			</div>
			<div :class="classes.exchangeInfo">
				<ui-skeleton height="var(--height-s11, 20px)" width="80px" />
				<ui-skeleton height="var(--height-s11, 20px)" width="40px" />
			</div>
		</div>
		<ui-skeleton
			:class="classes.more"
			height="var(--height-s11, 20px)"
			width="var(--height-s11, 20px)"
		/>
	</div>
</template>

<style module="classes">
.headerPreloader {
	display: flex;
	align-items: flex-end;
	box-sizing: border-box;
	height: 120px;
	padding: var(--padding-s9, 16px) 0;
	gap: 12px;
	border-bottom: 1px solid var(--color-border-surface-01, rgb(199 199 199 / 6%));
}

.logo {
	flex-shrink: 0;
}

.content {
	display: flex;
	align-items: flex-end;
	gap: var(--padding-s14, 32px);
}

.tickerInfo {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 202px;
	gap: 2px;
}

.breadcrumbs {
	margin-bottom: 4px;
}

.exchangeInfo {
	display: flex;
	align-items: center;
	height: var(--height-s14, 32px);
	gap: 4px;
}

.more {
	margin-left: auto;
}
</style>
