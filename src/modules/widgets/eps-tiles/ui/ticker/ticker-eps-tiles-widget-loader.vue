<script setup lang="ts">
import { BaseTickerWidgetWrapper } from '@/modules/widgets/base';
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<div :class="classes.grid">
		<base-ticker-widget-wrapper
			v-for="i in 4"
			:key="i"
			:class="classes.card"
		>
			<div :class="classes.header">
				<ui-skeleton width="70px" height="24px" />
			</div>
			<div :class="classes.body">
				<div :class="classes.rows">
					<div :class="classes.row">
						<div :class="[classes.rowHead, classes.left]">
							<ui-skeleton width="60px" height="14px" />
						</div>
						<div :class="[classes.rowBody, classes.left]">
							<ui-skeleton width="40px" height="20px" />
						</div>
					</div>
					<div :class="classes.row">
						<div :class="[classes.rowHead, classes.right]">
							<ui-skeleton width="55px" height="14px" />
						</div>
						<div :class="[classes.rowBody, classes.right]">
							<ui-skeleton width="50px" height="20px" />
						</div>
					</div>
				</div>
			</div>
			<div :class="classes.footer">
				<ui-skeleton width="60px" height="28px" />
				<ui-skeleton width="45px" height="24px" />
			</div>
		</base-ticker-widget-wrapper>
	</div>
</template>

<style module="classes">
.grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: var(--padding-s4, 6px);
	width: 100%;
}

.card {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
	height: 320px;
	gap: 10px;
}

.header {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 40px;
	padding: var(--padding-padding-s4, 6px) var(--padding-padding-s8, 14px);
}

.body {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	align-self: stretch;
}

.rows {
	display: flex;
	justify-content: center;
	align-items: flex-start;
	gap: var(--padding-padding-s2, 2px);
}

.row {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: var(--padding-padding-s1, 1px);
}

.rowHead {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 86px;
	padding: var(--padding-padding-s4, 6px) 0 var(--padding-padding-s3, 4px) 0;
	background: var(--atom-base-95, rgb(73 73 80 / 10%));
}

.rowHead.left {
	border-radius: var(--radius-radius-s14-32, 12.4px) 0 0 0;
}

.rowHead.right {
	border-radius: 0 var(--radius-radius-s14-32, 12.4px) 0 0;
}

.rowBody {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 86px;
	padding: var(--padding-padding-s6, 10px) 8px var(--padding-padding-s7, 12px) 8px;
	background: var(--atom-base-95, rgb(73 73 80 / 10%));
}

.rowBody.left {
	border-radius: 0 0 0 var(--radius-radius-s14-32, 12.4px);
}

.rowBody.right {
	border-radius: 0 0 var(--radius-radius-s14-32, 12.4px) 0;
}

.footer {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	align-self: stretch;
	gap: var(--padding-padding-s9, 16px);
}
</style>
